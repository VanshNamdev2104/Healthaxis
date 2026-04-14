import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Medicine name required"],
    trim: true,
  },

  genericName: {
    type: String,
    trim: true,
  },

  description: {
    type: String,
    required: true,
  },

  dosage: {
    type: String, 
    required: true,
  },

  sideEffects: {
    type: [String],
    default: [],
  },

  storage: {
    type: String, 
  },

  isPrescriptionRequired: {
    type: Boolean,
    default: false,
  },

  diseases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Disease",
    }
  ],

  images: [
    {
      url: { type: String, required: true },
      fileId: { type: String, required: true },
    }
  ]

}, { timestamps: true });

// Database indexes for better performance
medicineSchema.index({ name: 1 }); // Index for medicine name lookups
medicineSchema.index({ genericName: 1 }); // Index for generic name lookups
medicineSchema.index({ name: "text", description: "text", genericName: "text" }); // Text index for search
medicineSchema.index({ isPrescriptionRequired: 1 }); // Index for prescription filter
medicineSchema.index({ diseases: 1 }); // Index for disease-medicine relationship
medicineSchema.index({ createdAt: -1 }); // Index for sorting by creation date

export default mongoose.model("Medicine", medicineSchema);