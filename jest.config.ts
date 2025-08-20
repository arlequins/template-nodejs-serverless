/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
import { jestrc } from "@arlequins/common-config";

const moduleNameMapper = {
  "@functions/(.*)": "<rootDir>/src/functions/$1",
  "@lib/(.*)": "<rootDir>/src/lib/$1",
  "@settings/(.*)": "<rootDir>/src/settings/$1",
  "@typing/(.*)": "<rootDir>/src/typing/$1",
  "@constants/(.*)": "<rootDir>/src/constants/$1",
  "@tests/(.*)": "<rootDir>/src/tests/$1",
};

export default {
  ...jestrc,
  moduleNameMapper,
};
