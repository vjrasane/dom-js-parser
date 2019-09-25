import { isFunction, flatten } from "./utils";

const MECHANISM_ELEMENT_TYPE_SIGNATURE = "elem";
const MECHANISM_TYPE_SIGNATURE_PROP = "$__mechanism__type";

const mechanism = () => {
  // inner scope here
  return {
    createElement: (type, props, ...children) => {
      const flatChildren = flatten(children);
      if (isFunction(type)) {
        return type({ props, children: flatChildren });
      }
      return {
        type,
        props: props || {},
        children: flatChildren,
        [MECHANISM_TYPE_SIGNATURE_PROP]: MECHANISM_ELEMENT_TYPE_SIGNATURE
      };
    },
    Fragment: ({ children }) => flatten(children)
  };
};

export const isMechanismElement = obj =>
  obj[MECHANISM_TYPE_SIGNATURE_PROP] === MECHANISM_ELEMENT_TYPE_SIGNATURE;

export default mechanism();
