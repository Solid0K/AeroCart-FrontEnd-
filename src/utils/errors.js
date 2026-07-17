// Backend's GlobalExceptionHandler always responds with { statusCode, message }.
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return error?.response?.data?.message || fallback;
}
