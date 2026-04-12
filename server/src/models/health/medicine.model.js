import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Medicine name required"],
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  dosage: {
    type: String, 
    required: true
  },

  sideEffects: {
    type: [String],
    default: []
  },

  disease: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Disease", 
    required: true
  }

}, { timestamps: true });

export default mongoose.model("Medicine", medicineSchema);