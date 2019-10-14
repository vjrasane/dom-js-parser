import { Effect } from "~/engine/effect";
import { Cmd, Command, msgEventListener } from "~/engine/command";
import { isFunction } from "~/utils";

export class Subscription extends Effect {
  constructor(subscriber, cancel) {
    super(subscriber);
    this.canceller = cancel;
  }

  execute = async dispatchMsg => this.effect(dispatchMsg);
  cancel = sub => isFunction(this.canceller) && Cmd(() => this.canceller(sub));
}

export const Sub = (subscribe, cancel) => {
  let sub;
  const subscriber = dispatchMsg => {
    sub = subscribe(dispatchMsg);
  };
  const canceller = () => cancel(sub);
  return new Subscription(subscriber, canceller);
};

Sub.interval = (effect, duration) =>
  Sub(
    d =>
      setInterval(
        () => (effect instanceof Command ? effect.dispatch(d) : d(effect)),
        duration
      ),
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
