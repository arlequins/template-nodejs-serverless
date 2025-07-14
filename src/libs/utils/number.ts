import { setTime } from "./date";

/**
 * Checks if the given string represents a safe integer.
 * @param str - The string to check.
 * @returns True if the string is a safe integer, false otherwise.
 */
export const isIntegerString = (str?: string): boolean => {
  if (typeof str !== "string" || str.trim() === "") {
    return false;
  }
  // Check if the string is a valid integer (no decimals, no extra chars)
  if (!/^-?\d+$/.test(str.trim())) {
    return false;
  }
  const num = Number(str);
  return Number.isSafeInteger(num);
};

/**
 * Parses a string as an integer.
 * @param str - The string to parse.
 * @returns The parsed integer, or null if input is null, empty, or not a valid integer string.
 */
export const parseInteger = (str: string | null | undefined): number | null => {
  if (!isIntegerString(str ?? undefined)) {
    return null;
  }
  return Number(str);
};

/**
 * Parses a value as an integer if it's a string, or returns the number if it's already a number.
 * @param value - The value to parse (string, number, or null/undefined).
 * @returns The parsed integer or the number itself, or null if input is null or not a valid integer.
 */
export const parseColInteger = (
  value: string | number | null | undefined,
): number | null => {
  if (typeof value === "number" && Number.isSafeInteger(value)) {
    return value;
  }
  if (typeof value === "string" && isIntegerString(value)) {
    return Number(value);
  }
  return null;
};

/**
 * Parses a string as an integer only if it is a valid integer string.
 * @param str - The string to parse.
 * @returns The parsed integer, or null if not a valid integer string.
 */
export const parseWaitInteger = (
  str: string | null | undefined,
): number | null => (isIntegerString(str ?? undefined) ? Number(str) : null);

export const checkFloat = (value: number) => {
  if (value === undefined) {
    return true; // value is not provided, skip the test
  }
  return Number(value) === value && value % 1 !== 0;
};

export const checkValidDate = (year: number, month: number, day: number) => {
  const date = setTime(`${year}-${month}-${day}`);
  return (
    date.isValid() &&
    date.year() === year &&
    date.month() + 1 === month &&
    date.date() === day
  );
};
