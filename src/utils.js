export const isFunction = obj =>
  !!(obj && obj.constructor && obj.call && obj.apply);

export const flatten = arr => arr.flat(Infinity);

export const exists = obj => obj !== undefined && obj !== null;
