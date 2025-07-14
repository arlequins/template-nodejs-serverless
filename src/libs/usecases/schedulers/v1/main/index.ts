import makeGoogleClient from "@libs/api/googleapi/client";

export enum EventType {
  DRAFT = "draft",
}

const usecaseMain = async ({}: { type: EventType }): Promise<void> => {
  const { sheets: _sheets, drive: _drive } = await makeGoogleClient();

  // make your usecase logic here
  // for example, you can use sheets and drive clients to interact with Google Sheets and Drive
};

export default usecaseMain;
