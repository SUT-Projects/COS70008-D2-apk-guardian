import { buildApiUrl } from "@/lib/api";

// Auth endpoints
export const USER_LOGIN_URL = buildApiUrl("auth/login");

export const PREDICTION_URL = buildApiUrl("prediction/upload");
export const PREDICTION_RESULT_URL = buildApiUrl("prediction");