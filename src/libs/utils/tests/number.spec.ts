import { isIntegerString } from "@libs/utils/number";

describe("isIntegerString", () => {
  it("should return true when the string represents an integer", () => {
    const str = "123";
    const result = isIntegerString(str);
    expect(result).toBe(true);
  });

  it("should return false when the string does not represent an integer", () => {
    const str = "123.45";
    const result = isIntegerString(str);
    expect(result).toBe(false);
  });

  it("should return false when the string is empty", () => {
    const str = "";
    const result = isIntegerString(str);
    expect(result).toBe(false);
  });

  it("should return false when the string is not provided", () => {
    const result = isIntegerString(undefined);
    expect(result).toBe(false);
  });
});
