const enum RESPONSE_CODES {
  INIT = "init",
  GREEN = "green",
  SKIP = "skip",
  ERROR_101_BAD_PARAMS = "[101] bad params",
  ERROR_102_VALIDATION_CHECK = "[102] validation error",
  ERROR_103_UNEXPECTED = "[103] unexpected",
  ERROR_105_UNKNOWN = "[105] unknown error",
  ERROR_106_NO_TARGET = "[106] no target",
  ERROR_107_DATA_IS_NOT_MATCH = "[107] data is not match",

  ERROR_400_NO_DATA = "[400] no data",
}

export default RESPONSE_CODES;
