import { z } from "zod";

/**
 * Common Validators
 */
const phoneRegex = /^[0-9]{10}$/;

/**
 * Validation schema for user registration
 */
export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),

  number: z
    .string({ required_error: "Number is required" })
    .regex(phoneRegex, "Number must be exactly 10 digits"),

  role: z.enum(["user", "admin"]).optional(),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .toLowerCase()
    .email("Please provide a valid email"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

/**
 * Validation schema for user login (email OR number)
 */
export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email")
      .optional(),

    number: z
      .string()
      .regex(phoneRegex, "Number must be exactly 10 digits")
      .optional(),

    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required"),
  })

  // At least one required
  .refine((data) => data.email || data.number, {
    message: "Either email or number is required",
    path: ["email"],
  })

  // Not both together
  .refine((data) => !(data.email && data.number), {
    message: "Provide either email or number, not both",
    path: ["email"],
  });

/**
 * Validation schema for updating user profile
 */
export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be at most 50 characters")
      .optional(),

    number: z
      .string()
      .regex(phoneRegex, "Number must be exactly 10 digits")
      .optional(),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email")
      .optional(),
  })
  .refine((data) => data.name || data.number || data.email, {
    message: "At least one field must be provided to update",
  });