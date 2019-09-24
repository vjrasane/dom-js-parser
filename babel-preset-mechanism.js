const MECHANISM_JSX_PRAGMA = "Mechanism.elem";
const MECHANISM_JSX_FRAGMENT_PRAGMA = "Mechanism.fragment";

module.exports = function() {
  return {
    plugins: [
      [
        "@babel/transform-react-jsx",
        {
          pragma: MECHANISM_JSX_PRAGMA,
          pragmaFrag: MECHANISM_JSX_FRAGMENT_PRAGMA
        }
      ]
    ]
  };
};
