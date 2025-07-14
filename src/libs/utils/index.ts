import crypto from "crypto";
import { constants } from "@constants/environment";

/**
 * Converts a numeric fare amount to a locale-specific string representation in JPY format.
 *
 * @param fare - The fare amount as a number.
 * @returns The fare formatted as a locale string according to the Japanese Yen locale.
 */
export const replaceAmountToStringJPY = (fare: number): string =>
  fare.toLocaleString(constants.CURRENCY_LOCALE);

/**
 * Returns a promise that resolves after a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to wait before the promise resolves.
 * @returns A promise that resolves after the specified delay.
 */
export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculates the distance in meters between two geographic coordinates using the spherical law of cosines.
 *
 * @param cord1 - The first coordinate with latitude and longitude.
 * @param cord2 - The second coordinate with latitude and longitude.
 * @returns The distance between the two points in meters.
 */
export const getDistanceBetweenTwoPoints = (
  cord1: {
    lat: number;
    lng: number;
  },
  cord2: {
    lat: number;
    lng: number;
  },
): number => {
  if (cord1.lat === cord2.lat && cord1.lng === cord2.lng) {
    return 0;
  }

  const radlat1 = (Math.PI * cord1.lat) / 180;
  const radlat2 = (Math.PI * cord2.lat) / 180;

  const theta = cord1.lng - cord2.lng;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist *= 1.609344; // convert miles to km

  return dist * 1000; // convert to meter;
};

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
export const genRandomString = (length: number) =>
  crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */

/**
 * Generates a random string of the specified length using only uppercase and lowercase English letters.
 *
 * @param length - The desired length of the generated random string.
 * @returns A random string consisting of uppercase and lowercase letters.
 */
export const makeRandomStringInSelected = (length: number) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

/**
 * Generates a unique random string (hash code) of length 20 that does not exist in the provided list.
 *
 * Iteratively generates random strings using `makeRandomStringInSelected` until a string is found
 * that is not present in the input `list`. Returns the unique string.
 *
 * @param list - An array of strings to check for uniqueness against.
 * @returns A unique random string not present in the input list.
 */
export const makeHashCode = (list: string[]) => {
  const result = {
    last: undefined,
  };

  while (!result.last?.length) {
    const hash = makeRandomStringInSelected(20);
    const findHash = list.find((str) => str === hash);
    if (!findHash) {
      result.last = hash;
    }
  }
  return result.last;
};

/**
 * Generates a random number with exactly `n` digits, returned as a zero-padded string.
 *
 * @param n - The number of digits for the random number.
 * @returns A string representing a random number with `n` digits, left-padded with zeros if necessary.
 */
export const generateRandomNumber = (n: number) =>
  String(Math.ceil(Math.random() * 10 ** n)).padStart(n, "0");

/**
 * Builds a URL by appending query parameters to a base URL.
 *
 * @param baseUrl - The base URL to which query parameters will be appended.
 * @param params - An object representing key-value pairs to be used as query parameters.
 * @returns The resulting URL string with the query parameters appended.
 */
export const buildUrl = (
  baseUrl: string,
  params: Record<string, string>,
): string => {
  const queryString = new URLSearchParams(params).toString();
  return `${baseUrl}?${queryString}`;
};

/**
 * Compares two string arrays for equality.
 *
 * Returns `true` if both arrays have the same length and all corresponding elements are strictly equal (`===`).
 * Returns `false` otherwise.
 *
 * @param array1 - The first array of strings to compare.
 * @param array2 - The second array of strings to compare.
 * @returns `true` if the arrays are equal, `false` otherwise.
 */
export const areArraysEqual = (array1: string[], array2: string[]): boolean => {
  if (array1.length !== array2.length) {
    return false;
  }

  for (const [i, obj] of Object.entries(array1)) {
    if (obj !== array2[i]) {
      return false;
    }
  }

  return true;
};

/**
 * Converts an ArrayBuffer to a Node.js Buffer instance.
 *
 * @param arrayBuffer - The ArrayBuffer to convert.
 * @returns A Buffer containing the same bytes as the input ArrayBuffer.
 */
export const toBuffer = (arrayBuffer: ArrayBuffer) => {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; i += 1) {
    buffer[i] = view[i];
  }
  return buffer;
};
