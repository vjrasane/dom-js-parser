import { Effect } from "~/engine/effect";
import { Cmd, Command, msgEventListener } from "~/engine/command";

export class Subscription extends Effect {
  constructor(sub, cancel) {
    super(sub);
    this.canceller = cancel;
  }

  dispatch = async dispatchMsg => {
    this.subscription = this.effect(dispatchMsg);
  };

  cancel = () =>
    this.subscription &&
    this.canceller &&
    Cmd(() => this.canceller(this.subscription));
}

export const Sub = (sub, cancel) => new Subscription(sub, cancel);

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
