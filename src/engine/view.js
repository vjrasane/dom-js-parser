import freeze from "deep-freeze";
import { isFunction, always } from "~/utils";
import { MechanismElement } from "~/mechanism";

export default view => {
  if (view instanceof MechanismElement) {
    return always(freeze(view));
  } else if (isFunction(view)) {
    return model => freeze(view(model));
  } else {
    throw new Error(
      `Expected 'view' to be a function or element, was: '${typeof view}'`
    );
  }
};
