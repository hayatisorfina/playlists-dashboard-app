export type ApiFieldErrors = Record<string, string[]>;

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNPROCESSABLE_ENTITY"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNKNOWN_ERROR";

export type ApiErrorResponse = {
  status: number;
  code: ApiErrorCode;
  message: string;
  details?: string[];
  fieldErrors?: ApiFieldErrors;
};
