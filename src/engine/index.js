import getRenderer from "~/render";
import getUpdater from "~/engine/update";
import getInitializer from "~/engine/init";
import { getSubscriber, processIntervals, Sub } from "~/engine/subscriptions";
import { Cmd as InternalCmd, Return as InternalReturn } from "~/engine/command";
import getViewer from "~/engine/view";

const UPDATE_INTERVAL = 1; /* milliseconds */
const SUBSCRIPTION_INTERVAL = 1; /* milliseconds */
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

const Cmd = (effect, success, failure) =>
  new InternalCmd(effect, success, failure);

const Return = (model, ...cmds) => new InternalReturn(model, ...cmds);

export { Cmd, Return, Sub };

export default ({ init, update, view, subscriptions }) => ({ node, flags }) => {
  const queue = [];
  const dispatchMsg = msg => queue.push(msg);

  const renderer = getRenderer(dispatchMsg);
  const updater = getUpdater(update, dispatchMsg);
  const viewer = getViewer(view);
  const subscriber = getSubscriber(subscriptions);

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

  let subs = {};
  let subscribedModel;

  // subscription loop
  loop(() => {
    if (model && model !== subscribedModel) {
      subs = subscriber(model);
    }
  }, SUBSCRIPTION_INTERVAL);

  let lastIntervalExecution = Date.now();
  // interval subscription loop
  loop(() => {
    const now = Date.now();
    processIntervals(subs.intervals, now, lastIntervalExecution, dispatchMsg);
    lastIntervalExecution = now;
  }, 1 /* interval interval lol, obviously constant 1 millisecond */);
};
