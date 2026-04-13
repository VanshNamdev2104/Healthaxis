import { validationError } from "../utils/responsehandler.js";

/**
 * Generic Zod validation middleware for query parameters
 * Accepts a Zod schema and validates req.query against it
 * @param {import("zod").ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
const validateQuery = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
        const firstError = result.error.errors[0];
        return validationError(res, firstError.message);
    }

    // Replace req.query with the parsed (cleaned) data
    req.query = result.data;
    next();
};

/**
 * Generic Zod validation middleware for route parameters
 * Accepts a Zod schema and validates req.params against it
 * @param {import("zod").ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
const validateParams = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
        const firstError = result.error.errors[0];
        return validationError(res, firstError.message);
    }

    // Replace req.params with the parsed (cleaned) data
    req.params = result.data;
    next();
};

export { validateQuery, validateParams };
