import { isDayJs, setTime, setTimeFormat } from "@lib/utils/date";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ja from "dayjs/locale/ja";
import quarterOfYear from "dayjs/plugin/quarterOfYear";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(ja);
dayjs.extend(quarterOfYear);

describe("setTime", () => {
  it("should correctly set time", () => {
    const value = "2022-01-01T09:00:00Z"; // UTC time
    const result = setTime(value);
    expect(result.format()).toBe("2022-01-01T18:00:00+09:00");
  });

  it("should correctly set current time when no value is provided", () => {
    const result = setTime();
    expect(result.diff(dayjs(), "second")).toBeCloseTo(0, -1);
  });
});

describe("setTimeFormat", () => {
  it("should return a Dayjs object with the correct date when no format is provided", () => {
    const dateStr = "2022-01-01";
    const result = setTimeFormat(dateStr);
    expect(result.format("YYYY-MM-DD")).toBe(dateStr);
  });

  it("should return a Dayjs object with the correct date when a format is provided", () => {
    const dateStr = "01-01-2022";
    const format = "MM-DD-YYYY";
    const result = setTimeFormat(dateStr, format);
    expect(result.format("YYYY-MM-DD")).toBe("2022-01-01");
  });
});

describe("isDayJs", () => {
  it("should return true when a Dayjs object is provided", () => {
    const date = dayjs();
    const result = isDayJs(date);
    expect(result).toBe(true);
  });
});
