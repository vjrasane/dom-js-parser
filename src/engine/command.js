import { isFunction } from "~/utils";
import { Effect } from "~/engine/effect";

export class Cmd extends Effect {
  constructor(cmd, success, failure) {
    super(cmd, success, failure);
  }

  dispatch = async dispatchMsg => processCommand(this, dispatchMsg);
}

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
