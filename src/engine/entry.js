import getRenderer from "~/render";
import getInitializer from "~/engine/init";
import { getUpdater } from "~/engine/update";
import getViewer from "~/engine/view";
import { exists } from "~/utils";

const UPDATE_INTERVAL = 1; /* milliseconds */
const VIEW_INTERVAL = 10; /* milliseconds */
const RENDER_INTERVAL = 10; /* milliseconds */
const EFFECT_INTERVAL = 1; /* milliseconds */

const dispatcher = queue => queueable =>
  exists(queueable) && queue.push(queueable);

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
  // init empty queues
  const queues = {
    msg: [],
    effect: []
  };

  // create dispatcher for each queue
  const dispatchers = Object.entries(queues).reduce(
    (d, [key, queue]) => ({ ...d, [key]: dispatcher(queue) }),
    {}
  );

  const renderer = getRenderer(dispatchers.msg);
  const updater = getUpdater(update, dispatchers);
  const viewer = getViewer(view);

  let model = getInitializer(init, dispatchers)(flags);
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
      effect.execute(dispatchers.msg);
    }
  }, EFFECT_INTERVAL);
};
