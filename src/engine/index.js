import getRenderer from "~/render";
import { default as getUpdater, Cmd, Return } from "~/engine/update";
import initProgram from "~/engine/init";
import getViewer from "~/engine/view";

const UPDATE_INTERVAL = 1; /* milliseconds */
const VIEW_INTERVAL = 10; /* milliseconds */
const RENDER_INTERVAL = 10; /* milliseconds */

export { Cmd, Return };

export default ({ init, update, view }) => ({ node, flags }) => {
  const queue = [];
  const pushMsg = msg => queue.push(msg);

  const renderer = getRenderer(pushMsg);
  const updater = getUpdater(update, pushMsg);
  const viewer = getViewer(view);

  let model = initProgram(init, flags);
  // update loop
  setInterval(() => {
    if (queue.length > 0) {
      model = updater(queue.shift(), model);
    }
  }, UPDATE_INTERVAL);

  // view loop
  let viewedModel;
  let virtualDom;
  setInterval(() => {
    if (!viewedModel || viewedModel !== model) {
      virtualDom = viewer(model);
      viewedModel = model;
    }
  }, VIEW_INTERVAL);

  // render loop
  let renderedVirtualDom;
  setInterval(() => {
    if (virtualDom && virtualDom !== renderedVirtualDom) {
      renderer(node, virtualDom, renderedVirtualDom);
      renderedVirtualDom = virtualDom;
    }
  }, RENDER_INTERVAL);
};
