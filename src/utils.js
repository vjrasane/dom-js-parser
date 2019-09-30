export const isFunction = obj =>
  !!(obj && obj.constructor && obj.call && obj.apply);

export const flatten = arr => arr.flat(Infinity);

export const exists = obj => obj !== undefined && obj !== null;

export const always = obj => () => obj;

export const throwError = err => () => {
  throw err;
};

export const isString = obj => typeof obj === "string" || obj instanceof String;

export const partition = (array, condition) =>
  array.reduce(
    (acc, curr) => {
      acc[condition(curr) ? 0 : 1].push(curr);
      return acc;
    },
    [[], []]
  );

export const groupBy = (array, accessor) =>
  array.reduce((acc, curr) => {
    const key = accessor(curr);
    acc[key] = accessor(curr) in acc ? [...acc[key], curr] : [curr];
    return acc;
  }, {});
