import getRenderer from "~/render";
import getInitializer from "~/engine/init";
import { getUpdater } from "~/engine/update";
import getViewer from "~/engine/view";
import { dispatch, queues } from "~/engine/dispatch";

const UPDATE_INTERVAL = 1; /* milliseconds */
const VIEW_INTERVAL = 10; /* milliseconds */
const RENDER_INTERVAL = 10; /* milliseconds */
const EFFECT_INTERVAL = 1; /* milliseconds */

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

export default ({ init, update, view }) => ({ node, flags }) => {
  const renderer = getRenderer(dispatch);
  const updater = getUpdater(update, dispatch);
  const viewer = getViewer(view);

  let model = getInitializer(init, dispatch)(flags);
  // update loop
  loop(() => {
    if (queues.msg.length > 0) {
      model = updater(queues.msg.shift(), model);
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

  // effect loop
  loop(() => {
    if (queues.effect.length > 0) {
      const effect = queues.effect.shift();
      // execute effect with the message dispatcher
      effect.execute(dispatch);
    }
  }, EFFECT_INTERVAL);
};
