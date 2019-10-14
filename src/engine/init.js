import { isFunction } from "~/utils";
import process from "~/engine/process";

export default (init, dispatch) =>
  isFunction(init) ? process(init, dispatch) : init;
