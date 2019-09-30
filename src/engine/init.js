import { isFunction } from "~/utils";
import process from "~/engine/process";

export default (init, dispatchMsg) =>
  isFunction(init) ? process(init, dispatchMsg) : init;
