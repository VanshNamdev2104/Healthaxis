export function successResponse(res, data = {}, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
}

export function errorResponse(res, error, message = "Error", statusCode = 500) {
    const errorMessage = typeof error === "string" ? error : error?.message || "Unknown error";
    return res.status(statusCode).json({
        success: false,
        message,
        error: errorMessage
    });
}

export function validationError(res, error, message = "Validation Error", statusCode = 400) {
    const errorMessage = typeof error === "string" ? error : error?.message || "Validation failed";
    return res.status(statusCode).json({
        success: false,
        message,
        error: errorMessage
    });
}

export function notFoundResponse(res, message = "Not Found", statusCode = 404) {
    return res.status(statusCode).json({
        success: false,
        message,
        error: message
    });
}

export function unauthorizedResponse(res, message = "Unauthorized", statusCode = 401) {
    return res.status(statusCode).json({
        success: false,
        message,
        error: message
    });
}

export function forbiddenResponse(res, message = "Forbidden", statusCode = 403) {
    return res.status(statusCode).json({
        success: false,
        message,
        error: message
    });
}

export function conflictResponse(res, message = "Conflict", statusCode = 409) {
    return res.status(statusCode).json({
        success: false,
        message,
        error: message
    });
}

export function internalError(res, message = "Internal Server Error", statusCode = 500) {
    return res.status(statusCode).json({
        success: false,
        message,
        error: message
    });
}