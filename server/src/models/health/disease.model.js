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
  }

}, { timestamps: true });

export default mongoose.model("Disease", diseaseSchema);