import getRenderer from "~/render";
import getUpdater from "~/engine/update";
import getInitializer from "~/engine/init";
import { Cmd, Return } from "~/engine/command";
import getViewer from "~/engine/view";

const UPDATE_INTERVAL = 1; /* milliseconds */
const VIEW_INTERVAL = 10; /* milliseconds */
const RENDER_INTERVAL = 10; /* milliseconds */

const loop = (procedure, interval) => {
  let lock = false;
  setInterval(() => {
    if (!lock) {
      lock = true;
      procedure();
      lock = false;
    }
  }, interval);
};

export { Cmd, Return };

export default ({ init, update, view }) => ({ node, flags }) => {
  const queue = [];
  const dispatchMsg = msg => queue.push(msg);

  const renderer = getRenderer(dispatchMsg);
  const updater = getUpdater(update, dispatchMsg);
  const viewer = getViewer(view);

  let model = getInitializer(init, dispatchMsg)(flags);
  // update loop
  loop(() => {
    if (queue.length > 0) {
      model = updater(queue.shift(), model);
    }
  }, UPDATE_INTERVAL);

  // view loop
  let viewedModel;
  let virtualDom;
  loop(() => {
    if (model && model !== viewedModel) {
      virtualDom = viewer(model);
      viewedModel = model;
    }
  }, VIEW_INTERVAL);

  // render loop
  let renderedVirtualDom;
  loop(() => {
    if (virtualDom && virtualDom !== renderedVirtualDom) {
      renderer(node, virtualDom, renderedVirtualDom);
      renderedVirtualDom = virtualDom;
    }
  }, RENDER_INTERVAL);
};
