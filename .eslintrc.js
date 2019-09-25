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
    "react/jsx-no-undef": "error",
    "react/jsx-wrap-multilines": "error",
    "react/jsx-tag-spacing": "error",
    "react/jsx-space-before-closing": "error",
    "react/jsx-pascal-case": "warn",
    "react/jsx-no-comment-textnodes": "warn",
    "react/jsx-no-duplicate-props": "warn",
    "react/forbid-component-props": ["warn", { forbid: ["className"] }]
  },
  settings: {
    react: {
      pragma: "Mechanism"
    }
  }
};
