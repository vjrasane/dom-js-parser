import { Effect } from "~/engine/effect";
import { Command, msgEventListener } from "~/engine/command";

export class Subscription extends Effect {
  constructor(sub) {
    super(sub);
  }

  dispatch = async dispatchMsg => this.effect(dispatchMsg);
}

class Interval extends Subscription {
  constructor(effect, duration) {
    super(d => {
      this.interval = setInterval(
        () => (effect instanceof Command ? effect.dispatch(d) : d(effect)),
        duration
      );
    });
  }

  clear = () => clearInterval(this.interval);
}

class Listener extends Subscription {
  constructor(trigger, effect) {
    super(d => {
      this.listener = msgEventListener(effect, d);
      window.addEventListener(trigger, this.listener);
    });
    this.trigger = trigger;
  }

  remove = () => window.removeEventListener(this.trigger, this.listener);
}

export const Sub = sub => new Subscription(sub);
Sub.interval = (cmd, duration) => new Interval(cmd, duration);
Sub.listen = (trigger, effect) => new Listener(trigger, effect);
