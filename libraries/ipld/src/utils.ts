// use lodash castArray?
export const castArray = <T>(data: T | T[] = []): T[] => (Array.isArray(data) ? data : [data]);

export const concatArraysAndFilterDuplicates = <T>([a, b]: [T[], T[]]): T[] => [
  ...new Set([...a, ...b])
];

/* simple Promise.all wrapper for easier chaining */
export const asyncMap = <T, K>(
  input: T | T[],
  callback: (value: T, index: number, array: T[]) => Promise<K>
) => Promise.all(castArray(input).map(callback));
