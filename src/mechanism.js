const MECHANISM_OBJECT_SIGNATURE = "mechanism";
const MECHANISM_OBJECT_SIGNATURE_PROP = "$__signature";

const mechanism = () => {
  // inner scope here
  return {
    elem: (type, props, ...children) => ({
      type,
      props: props || {},
      children,
      [MECHANISM_OBJECT_SIGNATURE_PROP]: MECHANISM_OBJECT_SIGNATURE
    }),
    fragment: () => {} // TODO: implement fragments
  };
};

export const isMechanismObject = obj =>
  obj[MECHANISM_OBJECT_SIGNATURE_PROP] === MECHANISM_OBJECT_SIGNATURE;

export default mechanism();
