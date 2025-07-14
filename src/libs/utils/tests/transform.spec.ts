import {
  objKeyToCamelCase,
  objKeyToSnakeCase,
  transformEnumToArray,
} from "@libs/utils/transform";

describe("objKeyToSnakeCase", () => {
  it("should return an object with the keys transformed to snake case", () => {
    const input = { testKey: "value", anotherTestKey: "another value" };
    const result = objKeyToSnakeCase(input);
    expect(result).toEqual({
      test_key: "value",
      another_test_key: "another value",
    });
  });
  // numberのkeyでもstringに変換されため、カバレッジL14, 30のテストは不要
  it("should return an object with the keys transformed to snake case", () => {
    const input = { 111: "value", anotherTestKey: "another value" };
    const result = objKeyToSnakeCase(input);
    expect(result).toEqual({
      111: "value",
      another_test_key: "another value",
    });
  });
  it("should return an object with the keys transformed to snake case", () => {
    const input = { "|||": "value", anotherTestKey: "another value" };
    const result = objKeyToSnakeCase(input);
    expect(result).toEqual({
      "|||": "value",
      another_test_key: "another value",
    });
  });
});

describe("objKeyToCamelCase", () => {
  it("should return an object with the keys transformed to camel case", () => {
    const input = { test_key: "value", another_test_key: "another value" };
    const result = objKeyToCamelCase(input);
    expect(result).toEqual({
      testKey: "value",
      anotherTestKey: "another value",
    });
  });

  it("should return an object with the keys transformed to camel case", () => {
    const input = { 111: "value", another_test_key: "another value" };
    const result = objKeyToCamelCase(input);
    expect(result).toEqual({
      111: "value",
      anotherTestKey: "another value",
    });
  });

  it("should return an object with the keys transformed to camel case", () => {
    const input = { "|||": "value", another_test_key: "another value" };
    const result = objKeyToCamelCase(input);
    expect(result).toEqual({
      "|||": "value",
      anotherTestKey: "another value",
    });
  });
});

describe("transformEnumToArray", () => {
  it("should return an array representing the given enum", () => {
    enum TestEnum {
      A = 1,
      B = 2,
      C = 3,
    }
    const result = transformEnumToArray(TestEnum);
    expect(result).toEqual([
      { id: "A", value: 1 },
      { id: "B", value: 2 },
      { id: "C", value: 3 },
    ]);
  });
});
