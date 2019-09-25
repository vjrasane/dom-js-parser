module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ["prettier"],
  plugins: ["prettier", "react"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    "no-undef": "error",
    "no-unused-vars": "warn",
    "react/react-in-jsx-scope": "error",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/jsx-wrap-multilines": "error",
    "react/jsx-tag-spacing": "error",
    "react/jsx-space-before-closing": "error"
  },
  settings: {
    react: {
      pragma: "Mechanism"
    }
  }
};
