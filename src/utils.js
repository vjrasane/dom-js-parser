export const isFunction = obj =>
  !!(obj && obj.constructor && obj.call && obj.apply)
