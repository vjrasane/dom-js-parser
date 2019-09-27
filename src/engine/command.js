import { isFunction } from "~/utils";
import freeze from "deep-freeze";

export class Cmd {
  constructor(effect, success, failure) {
    this.effect = effect;
    this.success = success;
    this.failure = failure;
  }
}

export class Return {
  constructor(model, ...cmds) {
    this.model = model;
    this.cmds = cmds || [];
  }

  map = f => new Return(f(this.model), ...this.cmds);

  cmd = c => new Return(this.model, c, ...this.cmds);
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

export default (procedure, dispatchMsg) => (context, model) => {
  const procesed = procedure(context, model);
  if (procesed instanceof Return) {
    procesed.cmds.forEach(cmd => processCommand(cmd, dispatchMsg));
    return freeze(procesed.model);
  } else if (procesed instanceof Cmd) {
    processCommand(procesed, dispatchMsg);
    return model;
  }
  return freeze(procesed);
};
