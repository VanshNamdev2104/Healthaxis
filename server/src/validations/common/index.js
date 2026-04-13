import { z } from "zod";

/**
 * Common validation schemas for route parameters and queries
 */

/**
 * MongoDB ObjectId validation
 */
export const objectIdSchema = z.object({
  id: z
    .string()
    .min(1, "ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});

/**
 * Pagination query parameters
 */
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val) : 1)
    .refine((val) => val >= 1, "Page must be at least 1"),
    
  limit: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val) : 10)
    .refine((val) => val >= 1 && val <= 100, "Limit must be between 1 and 100"),
});

/**
 * Search query parameters
 */
export const searchQuerySchema = z.object({
  q: z
    .string({ required_error: "Search query is required" })
    .trim()
    .min(1, "Search query cannot be empty")
    .max(100, "Search query must be at most 100 characters"),
    
  ...paginationSchema.shape,
});

/**
 * Sort query parameters
 */
export const sortSchema = z.object({
  sortBy: z
    .string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(val), "Invalid sort field"),
    
  sortOrder: z
    .enum(["asc", "desc"])
    .optional(),
});

/**
 * Date range query parameters
 */
export const dateRangeSchema = z.object({
  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), "Invalid start date format"),
    
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), "Invalid end date format"),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: "Start date must be before or equal to end date",
  path: ["endDate"],
});
