import environment from "@constants/environment";
import { loggingError } from "@lib/utils/logger";
import { google } from "googleapis";
import { decode } from "js-base64";

// Type definition for the decoded Google service account certificate
type DecodeCert = {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
};

/**
 * Decodes a base64-encoded Google service account key.
 * @param serviceAgent - Base64 encoded service account key string
 * @returns Decoded certificate object
 * @throws Error if decoding or parsing fails
 */
const getDecodeCert = (serviceAgent: string): DecodeCert => {
  try {
    return JSON.parse(decode(serviceAgent));
  } catch (e) {
    loggingError("Error decoding service agent", e);
    throw e;
  }
};

/**
 * Creates and returns authenticated Google Drive and Sheets clients.
 * Reads the service account key from environment or file if not present.
 * @returns Object containing Google Drive and Sheets clients
 * @throws Error if service account key is missing or invalid
 */
const makeGoogleClient = async () => {
  const decodeCert: DecodeCert = getDecodeCert(environment.gcp.key);

  // Initialize Google Auth with the decoded credentials
  const auth = new google.auth.GoogleAuth({
    credentials: decodeCert,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
    clientOptions: {
      subject: environment.gcp.email,
    },
  });

  // Get the authenticated client
  const client = await auth.getClient();

  // Create Google Drive and Sheets API clients
  const drive = google.drive({
    version: "v3",
    auth: client as unknown as string, // Type assertion for compatibility
  });
  const sheets = google.sheets({
    version: "v4",
    auth: client as unknown as string,
  });

  return {
    drive,
    sheets,
  };
};

export default makeGoogleClient;
