import { z } from "zod";

/**
 * Validation schema for hospital registration
 */
export const createHospitalSchema = z.object({
  hospitalName: z
    .string({ required_error: "Hospital name is required" })
    .trim()
    .min(2, "Hospital name must be at least 2 characters")
    .max(100, "Hospital name must be at most 100 characters"),

  address: z
    .string({ required_error: "Address is required" })
    .trim()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be at most 500 characters"),

  city: z
    .string({ required_error: "City is required" })
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must be at most 50 characters"),

  state: z
    .string({ required_error: "State is required" })
    .trim()
    .min(2, "State must be at least 2 characters")
    .max(50, "State must be at most 50 characters"),

  country: z
    .string({ required_error: "Country is required" })
    .trim()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country must be at most 50 characters"),

  pincode: z
    .string({ required_error: "Pincode is required" })
    .trim()
    .regex(/^[0-9]{6}$/, "Pincode must be exactly 6 digits"),

  contactNumber: z
    .string({ required_error: "Contact number is required" })
    .trim()
    .regex(/^[0-9]{10}$/, "Contact number must be exactly 10 digits"),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email"),

  type: z
    .enum(["public", "private"], { required_error: "Type is required" }),

  speciality: z
    .string()
    .trim()
    .max(200, "Speciality must be at most 200 characters")
    .optional()
});

/**
 * Validation schema for doctor creation
 */
export const createDoctorSchema = z.object({
  name: z
    .string({ required_error: "Doctor name is required" })
    .trim()
    .min(2, "Doctor name must be at least 2 characters")
    .max(100, "Doctor name must be at most 100 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email"),

  contect: z
    .string({ required_error: "Contact number is required" })
    .trim()
    .regex(/^[0-9]{10}$/, "Contact number must be exactly 10 digits"),

  specialization: z
    .string({ required_error: "Specialization is required" })
    .trim()
    .min(2, "Specialization must be at least 2 characters")
    .max(100, "Specialization must be at most 100 characters"),

  experience: z
    .string({ required_error: "Experience is required" })
    .trim()
    .min(1, "Experience is required")
    .max(50, "Experience must be at most 50 characters"),

  fee: z
    .number({ required_error: "Consultation fee is required" })
    .min(0, "Consultation fee must be at least 0")
    .max(10000, "Consultation fee must be at most 10000")
});

/**
 * Validation schema for appointment creation
 */
export const createAppointmentSchema = z.object({
  name: z
    .string({ required_error: "Patient name is required" })
    .trim()
    .min(2, "Patient name must be at least 2 characters")
    .max(100, "Patient name must be at most 100 characters"),

  reason: z
    .string({ required_error: "Reason for appointment is required" })
    .trim()
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason must be at most 500 characters"),

  date: z
    .string({ required_error: "Date is required" })
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),

  time: z
    .string({ required_error: "Time is required" })
    .trim()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format (24-hour)"),

  age: z
    .string({ required_error: "Age is required" })
    .trim()
    .regex(/^[0-9]{1,3}$/, "Age must be a valid number between 0-999"),

  gender: z
    .enum(["male", "female", "other"], { required_error: "Gender is required" }),

  phoneNo: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

  alternateNo: z
    .string({ required_error: "Alternate number is required" })
    .trim()
    .regex(/^[0-9]{10}$/, "Alternate number must be exactly 10 digits")
});

/**
 * Validation schema for appointment approval
 */
export const approveAppointmentSchema = z.object({
  date: z
    .string({ required_error: "Date is required" })
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),

  time: z
    .string({ required_error: "Time is required" })
    .trim()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format (24-hour)")
});

/**
 * Validation schema for hospital search
 */
export const hospitalSearchSchema = z.object({
  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must be at most 50 characters")
    .optional(),

  state: z
    .string()
    .trim()
    .min(2, "State must be at least 2 characters")
    .max(50, "State must be at most 50 characters")
    .optional(),

  type: z
    .enum(["public", "private"])
    .optional(),

  speciality: z
    .string()
    .trim()
    .min(2, "Speciality must be at least 2 characters")
    .max(100, "Speciality must be at most 100 characters")
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
    .refine((val) => val >= 1, "Page must be at least 1")
});

/**
 * Validation schema for doctor search
 */
export const doctorSearchSchema = z.object({
  specialization: z
    .string()
    .trim()
    .min(2, "Specialization must be at least 2 characters")
    .max(100, "Specialization must be at most 100 characters")
    .optional(),

  hospitalId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid hospital ID format")
    .optional(),

  minFee: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val) : undefined)
    .refine((val) => !val || val >= 0, "Minimum fee must be at least 0"),

  maxFee: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val) : undefined)
    .refine((val) => !val || val >= 0, "Maximum fee must be at least 0"),

  limit: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val) : 10)
    .refine((val) => val >= 1 && val <= 50, "Limit must be between 1 and 50"),

  page: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val) : 1)
    .refine((val) => val >= 1, "Page must be at least 1")
}).refine((data) => {
  if (data.minFee && data.maxFee && data.minFee > data.maxFee) {
    return false;
  }
  return true;
}, {
  message: "Minimum fee cannot be greater than maximum fee",
  path: ["maxFee"]
});
