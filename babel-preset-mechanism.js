const MECHANISM_JSX_PRAGMA = "Mechanism.createElement";
const MECHANISM_JSX_FRAGMENT_PRAGMA = "Mechanism.Fragment";

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
