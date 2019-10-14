import { isFunction } from "~/utils";
import process from "~/engine/process";

export default (init, dispatchers) =>
  isFunction(init) ? process(init, dispatchers) : init;
