import { isFunction } from "~/utils";
import process from "~/engine/command";

export default (init, dispatchMsg) =>
  isFunction(init) ? process(init, dispatchMsg) : init;
