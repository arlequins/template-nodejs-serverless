import { EnvStage } from "@typing";

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
  // Google Cloud Platform credentials
  gcp: {
    key: process.env.GCP_SA_KEY ?? "",
    email: "email@example.com", // Fixed email, consider moving to env if needed
  },
  // AWS-specific configuration
  aws: {
    storage: process.env.AWS_S3_STORAGE_ID ?? "",
  },
  // Slack integration configuration
  slack: {
    oauthToken: process.env.SLACK_BOT_OAUTH_TOKEN ?? "",
    channel: process.env.SLACK_BOT_POST_CHANNEL ?? "",
  },
};

export default environment;
