import makeGoogleClient from "@lib/api/googleapi/client";
import { loggingDebug } from "@lib/utils/logger";

export enum EventType {
  DRAFT = "draft",
}

const usecaseMain = async ({ type }: { type: EventType }): Promise<void> => {
  loggingDebug(`usecaseMain called with type: ${type}`);

  const { sheets: _sheets, drive: _drive } = await makeGoogleClient();

  // make your usecase logic here
  // for example, you can use sheets and drive clients to interact with Google Sheets and Drive
};

export default usecaseMain;
