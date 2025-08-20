import { constants } from "@constants/environment";
import {
  genRandomString,
  getDistanceBetweenTwoPoints,
  makeHashCode,
  makeRandomStringInSelected,
  replaceAmountToStringJPY,
} from "@lib/utils/index";

describe("replaceAmountToStringJPY", () => {
  it("should return a string representing the amount in JPY format", () => {
    const fare = 123456;
    const result = replaceAmountToStringJPY(fare);
    expect(result).toBe(fare.toLocaleString(constants.CURRENCY_LOCALE));
  });
});

describe("getDistanceBetweenTwoPoints", () => {
  it("should return 0 when the two points are the same", () => {
    const cord1 = { lat: 35.6895, lng: 139.6917 };
    const cord2 = { lat: 35.6895, lng: 139.6917 };
    const result = getDistanceBetweenTwoPoints(cord1, cord2);
    expect(result).toBe(0);
  });

  it("should return the distance between the two points", () => {
    const cord1 = { lat: 35.6895, lng: 139.6917 }; // Tokyo
    const cord2 = { lat: 34.6937, lng: 135.5023 }; // Osaka
    const result = getDistanceBetweenTwoPoints(cord1, cord2);
    expect(result).toBeCloseTo(396416.5679161607, 1);
  });
});

describe("genRandomString", () => {
  it("should return a random string of the specified length", () => {
    const length = 10;
    const result = genRandomString(length);
    expect(result).toHaveLength(length);
  });

  it("should return a different string each time it is called", () => {
    const length = 10;
    const result1 = genRandomString(length);
    const result2 = genRandomString(length);
    expect(result1).not.toBe(result2);
  });
});

describe("makeRandomStringInSelected", () => {
  it("should return a random string of the specified length", () => {
    const length = 10;
    const result = makeRandomStringInSelected(length);
    expect(result).toHaveLength(length);
  });

  it("should return a string containing only uppercase and lowercase alphabets", () => {
    const length = 10;
    const result = makeRandomStringInSelected(length);
    expect(result).toMatch(/^[A-Za-z]+$/);
  });

  it("should return a different string each time it is called", () => {
    const length = 10;
    const result1 = makeRandomStringInSelected(length);
    const result2 = makeRandomStringInSelected(length);
    expect(result1).not.toBe(result2);
  });
});

describe("makeHashCode", () => {
  it("should return a hash code that does not exist in the given list", () => {
    const list = ["abc", "def", "ghi"];
    const result = makeHashCode(list);
    expect(list).not.toContain(result);
  });

  it("should return a different hash code each time it is called", () => {
    const list = ["abc", "def", "ghi"];
    const result1 = makeHashCode(list);
    const result2 = makeHashCode(list);
    expect(result1).not.toBe(result2);
  });
});
