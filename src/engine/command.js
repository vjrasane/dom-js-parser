import { isFunction } from "~/utils";
import { Effect } from "~/engine/effect";

export class Command extends Effect {
  constructor(cmd, success, failure) {
    super(cmd);
    this.success = success;
    this.failure = failure;
  }

  execute = async dispatch => processCommand(this, dispatch);
}

class Result extends Command {
  constructor(result) {
    super(result);
  }

  execute = async dispatch => dispatch(this.effect);
}

export const Cmd = (cmd, success, failure) =>
  new Command(cmd, success, failure);
Cmd.result = result => new Result(result);

export const processCommand = async (cmd, dispatch) => {
  let msg;
  try {
    const effect = isFunction(cmd.effect) ? cmd.effect() : cmd.effect;
    const result = await effect;
    msg = isFunction(cmd.success) ? cmd.success(result) : cmd.success;
  } catch (error) {
    msg = isFunction(cmd.failure) ? cmd.failure(error) : cmd.failure;
  }
  dispatch(msg);
};

export const msgEventListener = (msg, dispatch) =>
  isFunction(msg) ? (...args) => dispatch(msg(...args)) : () => dispatch(msg);
