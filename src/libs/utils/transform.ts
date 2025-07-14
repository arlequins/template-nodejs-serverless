/* eslint-disable @typescript-eslint/no-explicit-any */
import { isIntegerString } from "./number";

const DELIMITER = "|";

/**
 * Converts a string or number to snake_case.
 */
const toSnakeCase = (input: string | number): string => {
  const str = String(input);
  const array = str.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g,
  );
  return array ? array.map((x) => x.toLowerCase()).join("_") : str;
};

/**
 * Converts a string or number to camelCase.
 */
const toCamelCase = (input: string | number): string => {
  const str = String(input).replace(/[-_\s.]+(.)?/g, (_, c) =>
    c ? c.toUpperCase() : "",
  );
  return str.charAt(0).toLowerCase() + str.slice(1);
};

/**
 * Converts all keys of an object to snake_case (shallow).
 */
export const objKeyToSnakeCase = <T extends Record<string, any>>(obj: T): T => {
  const o: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      o[toSnakeCase(key)] = obj[key];
    }
  }
  return o as T;
};

/**
 * Converts all keys of an object to camelCase (shallow).
 */
export const objKeyToCamelCase = <T extends Record<string, any>>(obj: T): T => {
  const o: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      o[toCamelCase(key)] = obj[key];
    }
  }
  return o as T;
};

/**
 * Recursively converts all keys of an object or array to snake_case.
 */
export const convertKeysToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToSnakeCase);
  } else if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        toSnakeCase(key),
        convertKeysToSnakeCase(value),
      ]),
    );
  }
  return obj;
};

type TypeConvertedMapValue<T> = {
  index: number;
  item: T;
};

export type TypeConvertedMap<T> = Map<
  string | number,
  TypeConvertedMapValue<T>
>;

/**
 * Converts an array to a Map using a specified key from each item.
 */
export const createArrayToMap = <T extends Record<string, any>>(
  list: T[],
  key: string | number,
  valueKey?: string | number,
): TypeConvertedMap<any> => {
  return new Map(
    list.map((item, index) => [
      item[key],
      {
        index,
        item: valueKey ? item[valueKey] : item,
      },
    ]),
  );
};

/**
 * Converts an array to a Set of composite keys, joined by a delimiter.
 */
export const createArrayToSet = <T extends Record<string, any>>(
  list: T[],
  keys: (string | number)[],
): Set<string> => {
  return new Set(
    list.map((item) => keys.map((key) => String(item[key])).join(DELIMITER)),
  );
};

/**
 * Checks if an item exists in a Set using composite keys.
 */
export const findInSet = <T extends Record<string, any>>(
  data: Set<string>,
  keys: (string | number)[],
  item: T,
): boolean => {
  return data.has(keys.map((key) => String(item[key])).join(DELIMITER));
};

/**
 * Checks if a composite key exists in a Set.
 */
export const findInSetWithCompositeKey = (
  data: Set<string>,
  keys: (string | number)[],
): boolean => {
  return data.has(keys.map(String).join(DELIMITER));
};

/**
 * Transforms an enum object to an array of objects with id and value properties.
 */
export const transformEnumToArray = <T extends Record<string, string | number>>(
  enumm: T,
): { id: string; value: number }[] => {
  return Object.keys(enumm)
    .filter((id) => !isIntegerString(id))
    .map((id) => ({
      id,
      value: Number(enumm[id]),
    }));
};
