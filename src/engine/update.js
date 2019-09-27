import { isFunction, throwError } from "~/utils";
import process from "~/engine/command";

const throwUpdateError = throwError(
  new Error(
    `Attempted to pass message to 'update', but it was not a function, was: ${typeof update}`
  )
);

export default (update, dispatchMsg) =>
  isFunction(update) ? process(update, dispatchMsg) : throwUpdateError;
