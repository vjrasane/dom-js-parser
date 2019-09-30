import { Effect } from "~/engine/effect";
import { Command } from "~/engine/command";

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

export const Sub = sub => new Subscription(sub);
Sub.interval = (cmd, duration) => new Interval(cmd, duration);
