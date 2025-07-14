import env from "@constants/environment";
import slackBot from "@libs/adaptors/slack";
import { EnvStage } from "@typing/index";

// Get the Slack channel from environment variables
const channel = env.slack.channel;

/**
 * Sends a debug message to Slack only in non-production and non-test environments.
 * @param message - The message to send.
 */
export const sendDebugSlackMessage = async (message: string): Promise<void> => {
  // Prevent sending debug messages in production or test environments
  if (env.stage === EnvStage.PRODUCTION || env.stage === EnvStage.TEST) {
    return;
  }

  await sendSlackMessage(message);
};

/**
 * Sends a message to the configured Slack channel.
 * @param message - The message to send.
 * @returns The result of the Slack API call or undefined if the message is empty.
 */
export const sendSlackMessage = async (message: string) => {
  // Do not send empty messages
  if (!message || !message.trim().length) {
    return;
  }

  // Send the message using the Slack bot
  return slackBot.chat.postMessage({
    channel,
    text: message,
  });
};
