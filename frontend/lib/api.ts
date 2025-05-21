import {
  API_BASE_KEY,
  API_BASE_URL,
  DEFAULT_API_ENV,
  MICROSERVICE_PREFIX,
} from "@/config/constants";

// Utility function to build a complete API URL
export const buildApiUrl = (
  endpoint: string, // The specific endpoint path (e.g., "auth/login")
  options?: {
    baseUrlKey?: API_BASE_KEY; // Type for the environment key (must be "PROD" or "DEV")
  },
): string => {
  const { baseUrlKey = DEFAULT_API_ENV } = options || {};
  // Get the base URL for the specified environment, defaulting to the DEV URL if not found
  const baseUrl = API_BASE_URL[baseUrlKey] ?? API_BASE_URL.DEV;

  // Return the complete URL by combining the base URL, microservice prefix, and endpoint
  return `${baseUrl}/${endpoint}`;
};
