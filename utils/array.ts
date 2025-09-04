export const addId = <T extends object>(array: T[]) => {
  return addIdKey(array, "id");
};

export const addIdKey = <T extends object, K extends string>(array: T[], idKey: K) => {
  return array.map((item, id) => ({ ...item, [idKey]: id }) as T & { [id in K]: number });
};

export const assureNotArray = <T>(array: T | T[]) => {
  return Array.isArray(array) ? array[0] : array;
};

export const chooseAtRandom = <T>(array: T[]) => {
  return array[Math.floor(Math.random() * array.length)];
};
