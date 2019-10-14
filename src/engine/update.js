import { isFunction, throwError } from "~/utils";
import { Return } from "~/engine/return";
import process from "~/engine/process";

const throwUpdateError = throwError(
  new Error(
    `Attempted to pass message to 'update', but it was not a function, was: ${typeof update}`
  )
);

export const Update = (model, ...effects) => new Return(model, ...effects);

export const getUpdater = (update, dispatch) =>
  isFunction(update) ? process(update, dispatch) : throwUpdateError;
