export const isFunction = obj =>
  !!(obj && obj.constructor && obj.call && obj.apply);

export const flatten = arr => arr.flat(Infinity);

export const exists = obj => obj !== undefined && obj !== null;

export const always = obj => () => obj;

export const throwError = err => () => {
  throw err;
};

export const isString = obj => typeof obj === "string" || obj instanceof String;
