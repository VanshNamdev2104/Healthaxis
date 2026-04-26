import Joi from "joi";

export const validationSchemas = {
  // User Validations
  userRegistration: Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(30),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    role: Joi.string().valid("patient", "doctor", "hospital", "admin").default("patient"),
    dateOfBirth: Joi.date().optional(),
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
    dateOfBirth: Joi.date(),
    address: Joi.string(),
    profileImage: Joi.string(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required().min(6),
    confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  }),

  // Hospital Validations
  createHospital: Joi.object({
    name: Joi.string().required().min(3).max(100),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    description: Joi.string().max(500),
    registrationNumber: Joi.string().required(),
    licenseDocument: Joi.string(),
    specializations: Joi.array().items(Joi.string()),
  }),

  updateHospital: Joi.object({
    name: Joi.string().min(3).max(100),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
    address: Joi.string(),
    description: Joi.string().max(500),
    specializations: Joi.array().items(Joi.string()),
  }),

  // Doctor Validations
  createDoctor: Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    specialization: Joi.string().required(),
    qualifications: Joi.array().items(Joi.string()).required(),
    experience: Joi.number().integer().min(0),
    licenseNumber: Joi.string().required(),
    hospitalId: Joi.string().required(),
    availability: Joi.array().items(
      Joi.object({
        day: Joi.string().valid(...["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
        startTime: Joi.string(),
        endTime: Joi.string(),
      })
    ),
  }),

  updateDoctor: Joi.object({
    name: Joi.string().min(2).max(50),
    specialization: Joi.string(),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
    experience: Joi.number().integer().min(0),
    availability: Joi.array().items(
      Joi.object({
        day: Joi.string(),
        startTime: Joi.string(),
        endTime: Joi.string(),
      })
    ),
  }),

  // Appointment Validations
  createAppointment: Joi.object({
    patientId: Joi.string().required(),
    doctorId: Joi.string().required(),
    hospitalId: Joi.string().required(),
    appointmentDate: Joi.date().required(),
    appointmentTime: Joi.string().required(),
    reason: Joi.string().max(500),
    notes: Joi.string().max(1000),
  }),

  updateAppointment: Joi.object({
    appointmentDate: Joi.date(),
    appointmentTime: Joi.string(),
    reason: Joi.string().max(500),
    notes: Joi.string().max(1000),
    status: Joi.string().valid("confirmed", "cancelled", "completed"),
  }),

  // Disease Validations
  createDisease: Joi.object({
    name: Joi.string().required().min(2).max(100),
    description: Joi.string().required(),
    symptoms: Joi.array().items(Joi.string()),
    causes: Joi.array().items(Joi.string()),
    treatments: Joi.array().items(Joi.string()),
    severity: Joi.string().valid("mild", "moderate", "severe"),
  }),

  // Medicine Validations
  createMedicine: Joi.object({
    name: Joi.string().required().min(2).max(100),
    genericName: Joi.string().required(),
    description: Joi.string(),
    dosage: Joi.string(),
    sideEffects: Joi.array().items(Joi.string()),
    price: Joi.number().positive(),
    manufacturer: Joi.string(),
  }),

  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),
  }),
};

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    req.validatedData = value;
    next();
  };
};
