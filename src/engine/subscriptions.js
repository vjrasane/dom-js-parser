import { processCommand } from "~/engine/command";
import { isFunction, partition, always } from "~/utils";

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

  static onEvent = (event, effect) => new Sub(event, effect);

  static interval = (duration, cmd) => new Sub("interval", { duration, cmd });
}

const process = subs => {
  const subArray = Array.isArray(subs) ? subs : [subs];
  const [intervals, events] = partition(
    subArray.filter(s => s instanceof Sub),
    s => s.trigger === "interval"
  );
  return {
    // TODO: improve events with keys
    intervals,
    events
  };
};

export const getSubscriber = subscriptions =>
  isFunction(subscriptions)
    ? model => process(subscriptions(model))
    : always(process(subscriptions));
