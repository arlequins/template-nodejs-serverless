import env from "@constants/environment";
import { loggingError } from "@libs/utils/logger";
import { google } from "googleapis";
import { decode } from "js-base64";
import fs from "fs";
import path from "path";

// Type definition for the decoded Google service account certificate
type DecodeCert = {
  data: {
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
  status: true;
};

/**
 * Decodes a base64-encoded Google service account key.
 * @param serviceAgent - Base64 encoded service account key string
 * @returns Decoded certificate object
 * @throws Error if decoding or parsing fails
 */
const getDecodeCert = (serviceAgent: string): DecodeCert => {
  try {
    return {
      data: JSON.parse(decode(serviceAgent)),
      status: true,
    };
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
  let decodeCert: DecodeCert;

  // Try to get the GCP key from environment, otherwise read from file
  if (env.gcp.key) {
    decodeCert = getDecodeCert(env.gcp.key);
  } else {
    const keyPath = path.resolve(process.cwd(), "gcp_key_base.txt");
    const keyContent = fs.readFileSync(keyPath, "utf-8");
    decodeCert = getDecodeCert(keyContent);
  }

  if (decodeCert?.status) {
    // Initialize Google Auth with the decoded credentials
    const auth = new google.auth.GoogleAuth({
      credentials: decodeCert.data,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
      ],
      clientOptions: {
        subject: env.gcp.email,
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
  }

  throw new Error("There is no GCP key");
};

export default makeGoogleClient;
