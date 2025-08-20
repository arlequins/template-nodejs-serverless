import { loggingError, loggingInfo } from "@lib/utils/logger";
import { sheets_v4 } from "googleapis";

/**
 * Type for optional parameters of setSheetData, excluding required ones.
 * Adjust this type if setSheetData's parameter signature changes.
 */
type SetSheetDataOptionalParams = Omit<
  Parameters<typeof setSheetData>[1],
  "spreadsheetId" | "range" | "values"
>;

/**
 * Generic function to update data in Google Sheets.
 * @template T - The type of the input data.
 * @param sheets - Google Sheets API client instance.
 * @param spreadsheetId - The target spreadsheet ID.
 * @param range - The sheet name and range to write data to (e.g., 'Sheet1!A1').
 * @param data - The original data to write to the sheet.
 * @param transformData - Function to transform the original data into a 2D array of strings for the Sheets API.
 * @param options - Additional options for setSheetData (e.g., insertDataOption).
 * @returns The response from the Sheets API.
 */
const updateSheetData = async <T>({
  sheets,
  spreadsheetId,
  range,
  data,
  transformData,
  options = {},
}: {
  sheets: sheets_v4.Sheets;
  spreadsheetId: string;
  range: string;
  data: T;
  transformData: (data: T) => string[][];
  options?: SetSheetDataOptionalParams;
}) => {
  const values = transformData(data);

  try {
    const response = await setSheetData(sheets, {
      spreadsheetId,
      range,
      values,
      ...options,
    });

    if (response.status !== 200) {
      loggingError(`Error updating sheet data for range ${range}`, response);
      throw new Error(
        `Error updating sheet data for range ${range}. Status: ${response.status}`,
      );
    }

    return response;
  } catch (error) {
    loggingError(`Failed to execute setSheetData for range ${range}`, error);
    throw error instanceof Error
      ? error
      : new Error(`Failed to execute setSheetData for range ${range}`);
  }
};

/**
 * Fetches data from a Google Sheet.
 * @param client - Google Sheets API client instance.
 * @param headerLine - The number of header rows (default: 1).
 * @param spreadsheetId - The spreadsheet ID.
 * @param range - The range to fetch (e.g., 'Sheet1!A1:C10').
 * @returns An object containing raw values, headers, and rows.
 */
export const fetchSheetData = async (
  client: sheets_v4.Sheets,
  {
    headerLine = 1,
    spreadsheetId,
    range,
  }: {
    headerLine?: number;
    spreadsheetId: string;
    range: string;
  },
) => {
  const sheetData = await client.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  if (sheetData.status !== 200) {
    loggingError("Error fetching data from sheet", sheetData);
    throw new Error("Error fetching data from sheet");
  }

  const values = sheetData.data.values ?? [];

  return {
    raw: [...values],
    headers: values.slice(0, headerLine),
    rows: values.slice(headerLine),
  };
};

/**
 * Appends data to a Google Sheet.
 * @param client - Google Sheets API client instance.
 * @param params - Parameters for appending data.
 * @returns The response from the Sheets API.
 */
export const setSheetData = async (
  client: sheets_v4.Sheets,
  {
    spreadsheetId,
    insertDataOption = "OVERWRITE",
    valueInputOption = "USER_ENTERED",
    range,
    values,
  }: {
    spreadsheetId: string;
    insertDataOption?: "OVERWRITE" | "INSERT_ROWS";
    valueInputOption?: "RAW" | "USER_ENTERED";
    range: string;
    values: string[][];
  },
) => {
  return await client.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption,
    insertDataOption,
    requestBody: {
      values,
    },
  });
};

/**
 * Clears data from a specified range in a Google Sheet.
 * @param sheets - Google Sheets API client instance.
 * @param params - Parameters including spreadsheetId and range.
 * @returns The response from the Sheets API.
 */
export const deleteSheetData = async (
  sheets: sheets_v4.Sheets,
  {
    spreadsheetId,
    range,
  }: {
    spreadsheetId: string;
    range: string;
  },
) => {
  return await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range,
  });
};

/**
 * Resets and updates a Google Sheet with new data.
 * @param sheets - Google Sheets API client instance.
 * @param spreadsheetId - The spreadsheet ID.
 * @param range - Object containing insert, refresh, and delete ranges.
 * @param rows - The new data to insert.
 * @returns An object with the status of reset and update operations.
 */
export const updateSheet = async (
  {
    sheets,
    spreadsheetId,
  }: {
    sheets: sheets_v4.Sheets;
    spreadsheetId: string;
  },
  {
    range,
    rows,
  }: {
    range: {
      insert: string;
      refresh: string;
      delete: string;
    };
    rows: string[][];
  },
) => {
  // Clear all data in the specified range
  const resetResponse = await deleteSheetData(sheets, {
    spreadsheetId,
    range: range.delete,
  });

  if (resetResponse.status !== 200) {
    loggingInfo("Failed to reset the sheet.");
    throw new Error("Failed to reset the sheet.");
  }

  // Insert new data into the sheet
  const updateResponse = await updateSheetData({
    sheets,
    spreadsheetId,
    range: range.insert,
    data: rows,
    transformData: (dataRows) => {
      if (!dataRows || dataRows.length === 0) {
        return [];
      }
      return dataRows.map((row) => [...row]);
    },
    options: {
      insertDataOption: "OVERWRITE",
      valueInputOption: "USER_ENTERED",
    },
  });

  if (updateResponse.status !== 200) {
    throw new Error("Failed to update the sheet.");
  }

  return {
    reset: resetResponse.status,
    update: updateResponse.status,
  };
};
