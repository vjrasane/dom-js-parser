import { Effect } from "~/engine/effect";
import { Cmd, Command, msgEventListener } from "~/engine/command";
import { isFunction } from "~/utils";

export class Subscription extends Effect {
  constructor(subscriber, cancel) {
    super(subscriber);
    this.canceller = cancel;
  }

  execute = async dispatch => this.effect(dispatch);
  cancel = sub => isFunction(this.canceller) && Cmd(() => this.canceller(sub));
}

export const Sub = (subscribe, cancel) => {
  let sub;
  const subscriber = dispatch => {
    sub = subscribe(dispatch);
  };
  const canceller = () => cancel(sub);
  return new Subscription(subscriber, canceller);
};

Sub.interval = (effect, duration) =>
  Sub(
    dispatch => setInterval(() => dispatch(effect), duration),
    interval => clearInterval(interval)
  );

Sub.listen = (trigger, effect) =>
  Sub(
    dispatch => {
      const listener = msgEventListener(effect, dispatch);
      window.addEventListener(trigger, listener);
      return listener;
    },
    listener => window.removeEventListener(trigger, listener)
  );
