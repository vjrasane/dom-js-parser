import { isFunction, throwError } from "~/utils";
import process from "~/engine/process";

const throwUpdateError = throwError(
  new Error(
    `Attempted to pass message to 'update', but it was not a function, was: ${typeof update}`
  )
);

export class Update {
  constructor(model, ...effects) {
    this.model = model;
    this.effects = effects || [];
  }
}

export const getUpdater = (update, dispatchMsg) =>
  isFunction(update) ? process(update, dispatchMsg) : throwUpdateError;
