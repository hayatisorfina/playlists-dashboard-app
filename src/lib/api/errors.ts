import axios, { AxiosError } from "axios";

import type {
  ApiErrorCode,
  ApiErrorResponse,
  ApiFieldErrors,
} from "@/types/api";

type BackendValidationIssue = {
  field?: string;
  message?: string;
};

type BackendErrorPayload = {
  message?: string | string[];
  error?: string;
  details?: string[];
  errors?: BackendValidationIssue[];
  fieldErrors?: ApiFieldErrors;
};

const STATUS_TO_CODE: Record<number, ApiErrorCode> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "UNPROCESSABLE_ENTITY",
};

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly details?: string[];
  readonly fieldErrors?: ApiFieldErrors;

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.name = "ApiClientError";
    this.status = response.status;
    this.code = response.code;
    this.details = response.details;
    this.fieldErrors = response.fieldErrors;
  }
}

function normalizeMessage(payload?: BackendErrorPayload): string {
  if (!payload) {
    return "Something went wrong while contacting the API.";
  }

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  if (Array.isArray(payload.message) && payload.message.length > 0) {
    return payload.message.join(", ");
  }

  if (payload.error?.trim()) {
    return payload.error;
  }

  return "Something went wrong while contacting the API.";
}

function normalizeFieldErrors(
  payload?: BackendErrorPayload,
): ApiFieldErrors | undefined {
  if (!payload) {
    return undefined;
  }

  if (payload.fieldErrors && Object.keys(payload.fieldErrors).length > 0) {
    return payload.fieldErrors;
  }

  if (!payload.errors?.length) {
    return undefined;
  }

  return payload.errors.reduce<ApiFieldErrors>((fieldErrors, issue) => {
    if (!issue.field || !issue.message) {
      return fieldErrors;
    }

    const existingMessages = fieldErrors[issue.field] ?? [];
    fieldErrors[issue.field] = [...existingMessages, issue.message];
    return fieldErrors;
  }, {});
}

export function normalizeApiError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    return normalizeAxiosError(error);
  }

  return new ApiClientError({
    status: 0,
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred.",
  });
}

function normalizeAxiosError(
  error: AxiosError<BackendErrorPayload>,
): ApiClientError {
  if (error.code === "ERR_CANCELED") {
    return new ApiClientError({
      status: 0,
      code: "UNKNOWN_ERROR",
      message: "The request was canceled.",
    });
  }

  if (error.code === "ECONNABORTED") {
    return new ApiClientError({
      status: 0,
      code: "TIMEOUT",
      message: "The API request timed out.",
    });
  }

  if (!error.response) {
    return new ApiClientError({
      status: 0,
      code: "NETWORK_ERROR",
      message: "The API could not be reached.",
    });
  }

  const { status, data } = error.response;

  return new ApiClientError({
    status,
    code: STATUS_TO_CODE[status] ?? "UNKNOWN_ERROR",
    message: normalizeMessage(data),
    details: data?.details,
    fieldErrors: normalizeFieldErrors(data),
  });
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}
