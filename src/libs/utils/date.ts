import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ja from "dayjs/locale/ja";
import quarterOfYear from "dayjs/plugin/quarterOfYear";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(quarterOfYear);
dayjs.locale(ja);

export const DATE_FORMAT = "YYYY-MM-DD";
export const TIME_FORMAT = "HH:mm";
export const DTTM_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;
export const DATETIME_FORMAT = `${DATE_FORMAT} HH:mm:ss`;
export const S3_DATE_FORMAT = "YYYYMMDD";
export const S3_DATETIME_FORMAT = "YYYYMMDDHHmmss";

/**
 * Returns a Dayjs object for the given value, or the current time if no value is provided.
 */
export const setTime = (value?: string | Date): Dayjs =>
  value ? dayjs(value) : dayjs();

/**
 * Returns a Dayjs object for the given value and format, or uses setTime if no format is provided.
 */
export const setTimeFormat = (value: string, format?: string): Dayjs =>
  format ? dayjs(value, format) : setTime(value);

/**
 * Checks if the given value is a Dayjs object.
 */
export const isDayJs = (time: unknown): time is Dayjs => dayjs.isDayjs(time);

/**
 * Returns an array of Dayjs objects for each day between the start and end dates (inclusive).
 */
export const getDaysBetween = (start: Dayjs, end: Dayjs): Dayjs[] => {
  const range: Dayjs[] = [];
  let current = start.startOf("day");
  const last = end.startOf("day");
  while (!current.isAfter(last)) {
    range.push(current);
    current = current.add(1, "day");
  }
  return range;
};
