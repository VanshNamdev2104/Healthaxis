import mongoose from "mongoose";

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Disease name required"],
    trim: true,
    unique: true
  },

  description: {
    type: String,
    required: true
  },

  symptoms: {
    type: [String],
    default: []
  },

  causes: {
    type: [String],
    default: []
  },
  precautions: {
    type: [String],
    default: []
  },
  diagnosis: {
    type: [String],
    default: []
  },
  homeRemedies: {
    type: [String],
    default: []
  },

  images: [
    {
      url: { type: String, required: true },
      fileId: { type: String, required: true },
    }
  ]

}, { timestamps: true });

// Database indexes for better performance
// Note: name field already has unique index from schema definition
diseaseSchema.index({ name: "text", description: "text" }); // Text index for search
diseaseSchema.index({ symptoms: "text" }); // Text index for symptom search
diseaseSchema.index({ createdAt: -1 }); // Index for sorting by creation date

export default mongoose.model("Disease", diseaseSchema);


