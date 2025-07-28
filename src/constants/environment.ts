import { EnvStage } from "@typing";
import fs from "fs";
import path from "path";

type TypeConfigurationVariables = {
  gcp: {
    key: string;
    email: string;
  };
  slack: {
    oauthToken: string;
    channel: string;
  };
};

// Read config.json file synchronously
const configFileContent = fs.readFileSync(
  path.resolve(process.cwd(), "config.json"),
  "utf-8",
);
const configurationVariables: TypeConfigurationVariables =
  JSON.parse(configFileContent);

// Determine if the current environment is a test environment
const isTest = process.env.NODE_ENV === "test";

// Commonly used constants throughout the application
export const constants = {
  CURRENCY_LOCALE: "ja-JP", // Locale for currency formatting
  API_TIMEOUT: 20000, // API timeout in milliseconds (20 seconds)
  ALLOWED_ORIGIN: "*", // Allowed CORS origin
};

// Environment-specific configuration
const environment = {
  isTest,
  // If running tests, always treat as offline; otherwise, use the environment variable
  isOffline: isTest ? true : process.env.IS_OFFLINE === "true",
  // Application stage (e.g., dev, prod), cast to EnvStage type
  stage: process.env.STAGE as EnvStage,
  // AWS region
  region: process.env.REGION ?? "",

  // AWS-specific configuration
  aws: {
    identifier: process.env.AWS_IDENTIFIER ?? "",
    storage: process.env.AWS_S3_STORAGE_ID ?? "",
  },

  // Google Cloud Platform credentials
  gcp: configurationVariables.gcp,

  // Slack integration configuration
  slack: configurationVariables.slack,
};

export default environment;
