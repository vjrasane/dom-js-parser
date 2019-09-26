import { isFunction } from "~/utils";
import freeze from "deep-freeze";

export default (init, flags) => {
  const initialModel = isFunction(init) ? init(flags) : init;
  return initialModel ? freeze(initialModel) : initialModel;
};
