export const isFunction = obj =>
  !!(obj && obj.constructor && obj.call && obj.apply);

export const exists = obj => obj !== undefined && obj !== null;
