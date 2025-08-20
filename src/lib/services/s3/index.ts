import { Readable } from "stream";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import client from "@lib/adaptors/s3";
import { loggingError } from "@lib/utils/logger";
import { ReadStream } from "fs";

/**
 * Downloads a file from S3 and returns its content as a string.
 * @param payload - S3 bucket and key information.
 * @returns The file content as a string.
 */
const downloadS3File = async (payload: {
  Bucket: string;
  Key: string;
}): Promise<string> => {
  const response = await client.send(new GetObjectCommand(payload));
  // transformToString is available in AWS SDK v3 for Node.js
  return response.Body?.transformToString("utf8") ?? "";
};

/**
 * Uploads a file to S3.
 * @param payload - S3 bucket, key, file body, and optional content type/encoding.
 * @returns The HTTP status code of the upload operation.
 */
const uploadS3File = async (payload: {
  Bucket: string;
  Key: string;
  Body: string | Buffer | ReadStream | Readable;
  ContentType?: string;
  ContentEncoding?: string;
}) => {
  const response = await client.send(new PutObjectCommand(payload));
  return {
    statusCode: response?.$metadata?.httpStatusCode,
  };
};

/**
 * Fetches and parses a JSON file from S3.
 * @param payload - S3 bucket and key information.
 * @returns The parsed JSON object or null if not found.
 * @throws Error if the file is empty or parsing fails.
 */
export const fetchS3JsonFile = async <T>(payload: {
  Bucket: string;
  Key: string;
}): Promise<T | null> => {
  try {
    const current = await downloadS3File(payload);

    if (!current.length) {
      throw new Error("File is empty");
    }

    return JSON.parse(current) as T;
  } catch (error) {
    loggingError("fetch s3 file", error);
    throw new Error(`Failed to fetch S3 file: ${error.message}`);
  }
};

/**
 * Uploads a JSON file to S3.
 * @param payload - S3 bucket, key, and file body.
 * @returns The HTTP status code of the upload operation.
 */
export const uploadS3JsonFile = async (payload: {
  Bucket: string;
  Key: string;
  Body: string | ReadStream | Buffer | Readable;
}) => {
  return await uploadS3File({
    ...payload,
    ContentType: "application/json",
  });
};
