import { isFunction } from "~/utils";
import { Effect } from "~/engine/effect";

export class Command extends Effect {
  constructor(cmd, success, failure) {
    super(cmd);
    this.success = success;
    this.failure = failure;
  }

  dispatch = async dispatchMsg => processCommand(this, dispatchMsg);
}

class Result extends Command {
  constructor(result) {
    super(result);
  }

  dispatch = async dispatchMsg => dispatchMsg(this.effect);
}

export const Cmd = (cmd, success, failure) =>
  new Command(cmd, success, failure);
Cmd.result = result => new Result(result);

export const processCommand = async (cmd, dispatchMsg) => {
  let msg;
  try {
    const effect = isFunction(cmd.effect) ? cmd.effect() : cmd.effect;
    const result = await effect;
    msg = isFunction(cmd.success) ? cmd.success(result) : cmd.success;
  } catch (error) {
    msg = isFunction(cmd.failure) ? cmd.failure(error) : cmd.failure;
  }
  dispatchMsg(msg);
};

export const msgEventListener = (msg, dispatchMsg) =>
  isFunction(msg)
    ? (...args) => dispatchMsg(msg(...args))
    : () => dispatchMsg(msg);
