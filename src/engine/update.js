import freeze from "deep-freeze";
import { isFunction, throwError } from "~/utils";

export class Cmd {
  constructor(msg, effect) {
    this.msg = msg;
    this.effect = effect;
  }
}

export class Return {
  constructor(model, cmd) {
    this.model = model;
    this.cmd = cmd;
  }
}

const processCommand = async (cmd, pushMsg) => {
  const effect = isFunction(cmd.effect) ? cmd.effect() : cmd.effect;
  const result = await effect;
  const msg = isFunction(cmd.msg) ? cmd.msg(result) : cmd.msg;
  pushMsg(msg);
};

const handleUpdate = (update, pushMsg) => (msg, model) => {
  const updated = update(msg, model);
  if (updated instanceof Return) {
    processCommand(updated.cmd, pushMsg);
    return freeze(updated.model);
  } else if (updated instanceof Cmd) {
    processCommand(updated.effect, pushMsg);
    return model;
  }
  return freeze(updated);
};

const throwUpdateError = throwError(
  new Error(
    `Attempted to pass message to 'update', but it was not a function, was: ${typeof update}`
  )
);

export default (update, pushMsg) =>
  isFunction(update) ? handleUpdate(update, pushMsg) : throwUpdateError;
