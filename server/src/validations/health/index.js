import { z } from "zod";

/**
 * Validation schema for disease search/query
 */
export const diseaseQuerySchema = z.object({
  query: z
    .string({ required_error: "Search query is required" })
    .trim()
    .min(2, "Search query must be at least 2 characters")
    .max(100, "Search query must be at most 100 characters"),
  
  limit: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val) : 10)
    .refine((val) => val >= 1 && val <= 50, "Limit must be between 1 and 50"),
  
  page: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val) : 1)
    .refine((val) => val >= 1, "Page must be at least 1"),
});

/**
 * Validation schema for medicine search/query
 */
export const medicineQuerySchema = z.object({
  query: z
    .string({ required_error: "Search query is required" })
    .trim()
    .min(2, "Search query must be at least 2 characters")
    .max(100, "Search query must be at most 100 characters"),
  
  type: z
    .enum(["tablet", "syrup", "capsule", "injection", "other"])
    .optional(),
  
  limit: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val) : 10)
    .refine((val) => val >= 1 && val <= 50, "Limit must be between 1 and 50"),
  
  page: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val) : 1)
    .refine((val) => val >= 1, "Page must be at least 1"),
});

/**
 * Validation schema for AI chat/health consultation
 */
export const healthConsultationSchema = z.object({
  problem: z
    .string({ required_error: "Problem description is required" })
    .trim()
    .min(10, "Problem description must be at least 10 characters")
    .max(2000, "Problem description must be at most 2000 characters"),
  
  age: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val) : undefined)
    .refine((val) => !val || (val >= 0 && val <= 150), "Age must be between 0 and 150"),
  
  gender: z
    .enum(["male", "female", "other"])
    .optional(),
  
  symptoms: z
    .array(z.string().min(1).max(100))
    .optional()
    .refine((val) => !val || val.length <= 10, "Maximum 10 symptoms allowed"),
  
  duration: z
    .string()
    .optional()
    .max(100, "Duration description must be at most 100 characters"),
});

/**
 * Validation schema for chat messages
 */
export const chatMessageSchema = z.object({
  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(1, "Message cannot be empty")
    .max(1000, "Message must be at most 1000 characters"),
  
  chatId: z
    .string({ required_error: "Chat ID is required" })
    .min(1, "Chat ID cannot be empty"),
});

/**
 * Validation schema for creating new chat
 */
export const createChatSchema = z.object({
  title: z
    .string({ required_error: "Chat title is required" })
    .trim()
    .min(3, "Chat title must be at least 3 characters")
    .max(100, "Chat title must be at most 100 characters"),
});
