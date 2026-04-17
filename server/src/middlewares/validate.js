import { validationError } from "../utils/responsehandler.js";

/**
 * Generic Zod validation middleware
 * Accepts a Zod schema and validates req.body against it
 * @param {import("zod").ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        // Extract the first error message for a clean response
        const errors = result.error.errors || result.error.issues || [];
        const firstError = errors[0];
        const errorMessage = firstError ? firstError.message : "Validation failed";
        return validationError(res, errorMessage);
    }

    // Replace req.body with the parsed (cleaned) data
    req.body = result.data;
    next();
};

export default validate;
