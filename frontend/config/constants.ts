// Define the base URLs for different environments (Production and Development)
export const API_BASE_URL = {
  PROD: process.env.NEXT_PUBLIC_PROD_BASE_URL, // Production API base URL from environment variables
  DEV: process.env.NEXT_PUBLIC_DEV_BASE_URL, // Development API base URL from environment variables
} as const;

// Type representing the keys of the API_BASE_URL object (e.g., "PROD" or "DEV")
export type API_BASE_KEY = keyof typeof API_BASE_URL;
export const DEFAULT_API_ENV =
  process.env.NODE_ENV === "production" ? "PROD" : "DEV";

// Type representing the valid microservice prefixes
export type MICROSERVICE_PREFIX = "authms" | "jobms" | "userprofilems";
