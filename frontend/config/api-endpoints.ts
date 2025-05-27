import { buildApiUrl } from "@/lib/api";

// Auth endpoints
export const USER_LOGIN_URL = buildApiUrl("auth/login");

export const PREDICTION_URL = buildApiUrl("prediction/upload");
export const PREDICTION_RESULT_URL = buildApiUrl("prediction");

export const FILTERED_USERS_URL = buildApiUrl("user/get-filtered-users");
export const UPDATE_USER_URL = buildApiUrl("user/update-user");
export const CREATE_USER_URL = buildApiUrl("user/create-new-user");