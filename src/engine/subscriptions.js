import { processCommand, msgEventListener } from "~/engine/command";
import { isFunction, partition, always, groupBy } from "~/utils";

const processInterval = (
  now,
  lastIntervalExec,
  dispatchMsg
) => async interval => {
  const { duration, cmd } = interval.opts;

  const lowerCount = Math.floor(lastIntervalExec / duration);
  const upperCount = Math.floor(now / duration);

  lowerCount < upperCount && processCommand(cmd, dispatchMsg);
};

let eventListenerSubs = {};
const attachListener = (trigger, eventListeners, dispatchMsg) => {
  const listener = (...args) => {
    const triggerEvents = eventListenerSubs[trigger] || [];
    triggerEvents.forEach(({ opts }) =>
      msgEventListener(opts.msg, dispatchMsg)(...args)
    );
  };
  eventListeners[trigger] = listener;
  window.addEventListener(trigger, listener);
};

const detatchListener = (trigger, eventListeners) => {
  window.removeEventListener(trigger, eventListeners[trigger]);
  delete eventListeners[trigger];
};

export const attachListeners = (eventSubs, eventListeners, dispatchMsg) => {
  eventListenerSubs = eventSubs;
  Object.keys(eventSubs).forEach(
    trigger =>
      !(trigger in eventListeners) &&
      attachListener(trigger, eventListeners, dispatchMsg)
  );
  Object.keys(eventListeners).forEach(
    trigger => !(trigger in eventSubs) && detatchListener(trigger)
  );
};

export const processIntervals = (
  intervals = [],
  now,
  lastIntervalExec,
  dispatchMsg
) => {
  const processor = processInterval(now, lastIntervalExec, dispatchMsg);
  intervals.forEach(processor);
};

export class Sub {
  constructor(trigger, opts) {
    this.trigger = trigger;
    this.opts = opts || {};
  }

  static event = (event, msg) => new Sub(event, { msg });

  static interval = (duration, cmd) => new Sub("interval", { duration, cmd });
}

const process = subs => {
  const subArray = Array.isArray(subs) ? subs : [subs];
  const [intervals, eventArray] = partition(
    subArray.filter(s => s instanceof Sub),
    s => s.trigger === "interval"
  );
  const events = groupBy(eventArray, e => e.trigger);
  return { intervals, events };
};

export const getSubscriber = subscriptions =>
  isFunction(subscriptions)
    ? model => process(subscriptions(model))
    : always(process(subscriptions));
