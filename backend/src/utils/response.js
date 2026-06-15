// Standardized JSON response helpers

export const successResponse = (data, message = null) => {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
};

export const errorResponse = (error, statusCode = 400) => {
  return {
    success: false,
    error: error.message || error,
    ...(error.details && { details: error.details }),
  };
};

