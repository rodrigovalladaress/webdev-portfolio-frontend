export const addId = <T extends object>(array: T[]) => {
  return addIdKey(array, "id");
};

export const addIdKey = <T extends object, K extends string>(array: T[], idKey: K) => {
  return array.map((item, id) => ({ ...item, [idKey]: id }) as T & { [id in K]: number });
};
