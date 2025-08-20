import { sendSlackMessage } from "@lib/api/slack";
import { loggingDebug } from "@lib/utils/logger";
import zlib from "zlib";

// Handler for processing CloudWatch Logs events and sending messages to Slack
const handler = async (event) => {
  try {
    // Decode base64-encoded CloudWatch Logs data
    const decodedData = Buffer.from(event.awslogs.data, "base64");

    // Decompress gzipped log data
    const unzippedData = zlib.gunzipSync(decodedData);

    // Parse JSON log data
    const jsonData = JSON.parse(unzippedData.toString("utf-8"));

    loggingDebug(jsonData);

    const logGroup = jsonData.logGroup;
    const responses = [];

    // Iterate over each log event and send to Slack
    for (const logEvent of jsonData.logEvents) {
      const message = logEvent.message;
      const text = `[${logGroup}] ${message}`;

      // Send message to Slack and collect response
      const response = await sendSlackMessage(text);
      responses.push(response);
    }

    // Return success response with status codes from Slack API
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Finished.",
        codes: responses.map((response) => response.status),
      }),
    };
  } catch (error) {
    // Log and return error response
    console.error("Error posting to Slack:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error posting to Slack.",
      }),
    };
  }
};

export const main = handler;
