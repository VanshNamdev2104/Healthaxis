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
        const firstError = result.error.errors[0];
        return validationError(res, firstError.message);
    }

    // Replace req.body with the parsed (cleaned) data
    req.body = result.data;
    next();
};

export default validate;
