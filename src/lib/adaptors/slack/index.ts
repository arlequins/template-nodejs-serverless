// Import environment variables and Slack WebClient
import env from "@constants/environment";
import { WebClient } from "@slack/web-api";

// Initialize a singleton Slack WebClient instance with the bot OAuth token
// Limit concurrency to 1 to avoid hitting Slack rate limits
const slackBot = new WebClient(env.slack.oauthToken, {
  maxRequestConcurrency: 1,
});

// Export the configured Slack WebClient instance for use in other modules
export default slackBot;
