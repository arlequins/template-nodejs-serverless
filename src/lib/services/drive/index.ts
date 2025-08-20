import { loggingError, loggingInfo } from "@lib/utils/logger";
import { drive_v3 } from "googleapis";

/**
 * Retrieves files from a specific Google Drive folder whose names start with the given prefix.
 * Handles pagination and logs the results.
 *
 * @param drive - An authenticated Google Drive client.
 * @param folderId - The ID of the folder to search within.
 * @param namePrefix - The prefix that file names should start with.
 * @returns An array of files matching the criteria.
 */
export const getFilesFromFolder = async (
  drive: drive_v3.Drive,
  folderId: string,
  namePrefix: string,
) => {
  const filesList: drive_v3.Schema$File[] = [];
  let pageToken: string | null | undefined = null;

  try {
    do {
      // Query files in the specified folder with the given name prefix
      const res = await drive.files.list({
        q: `name contains '${namePrefix}' and '${folderId}' in parents and trashed = false`,
        fields:
          "nextPageToken, files(id, name, mimeType, webViewLink, parents)",
        pageSize: 100,
        pageToken,
        orderBy: "createdTime",
      });

      // Filter files to ensure names actually start with the prefix
      if (res.data.files && res.data.files.length > 0) {
        const filteredFiles = res.data.files.filter((file) =>
          file.name?.startsWith(namePrefix),
        );
        filesList.push(...filteredFiles);
      }
      pageToken = res.data.nextPageToken;
    } while (pageToken);

    // Log results
    if (filesList.length) {
      loggingInfo(
        `Found ${filesList.length} files starting with "${namePrefix}" in folder "${folderId}":`,
      );
      filesList.forEach((file) => {
        loggingInfo(`- ${file.name} (${file.id}) - MimeType: ${file.mimeType}`);
      });
    } else {
      loggingInfo(
        `No files found starting with "${namePrefix}" in folder "${folderId}".`,
      );
    }
    return filesList;
  } catch (err) {
    loggingError("The API returned an error: ", err.message);
    if (err.errors) loggingError("errors:", err.errors);
    return [];
  }
};

/**
 * Moves a file to a different folder in Google Drive.
 * Removes the file from its previous parent folders and adds it to the target folder.
 *
 * @param drive - An authenticated Google Drive client.
 * @param fileId - The ID of the file to move.
 * @param targetFolderId - The ID of the destination folder.
 * @returns The updated file metadata, or null if the operation fails.
 */
export const moveFileToFolder = async (
  drive: drive_v3.Drive,
  fileId: string,
  targetFolderId: string,
) => {
  try {
    // Retrieve the current parent folders of the file
    const file = await drive.files.get({
      fileId,
      fields: "parents",
    });

    const previousParents = file.data.parents
      ? file.data.parents.join(",")
      : "";

    // Move the file by updating its parents
    const updatedFile = await drive.files.update({
      fileId,
      addParents: targetFolderId,
      removeParents: previousParents,
      fields: "id, parents",
    });

    loggingInfo(
      `File ${fileId} was moved to folder ${targetFolderId}. New parents: ${updatedFile.data.parents}`,
    );
    return updatedFile.data;
  } catch (err) {
    loggingError(
      `Failed to move file ${fileId} to folder ${targetFolderId}: `,
      err.message,
    );
    if (err.errors) loggingError("errors:", err.errors);
    return null;
  }
};
