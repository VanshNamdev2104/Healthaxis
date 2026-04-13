import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  number: {
    type: String,
    minlength: 10,
    maxlength: 10,
    default: null,
  },
  role: {
    type: String,
    enum: ["user", "admin","Doctor"],
    default: "user",
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    default: null,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
    default: null,
  },

  refreshToken: {
    type: String,
    default: null,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});

UserSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

// Database indexes for better performance
// Note: email and googleId already have unique indexes from schema definition
UserSchema.index({ number: 1 }); // Index for phone number lookups
UserSchema.index({ role: 1 }); // Index for role-based queries
UserSchema.index({ createdAt: -1 }); // Index for sorting by creation date
UserSchema.index({ resetPasswordToken: 1 }); // Index for password reset lookups
UserSchema.index({ resetPasswordExpires: 1 }); // Index for expired token cleanup

export default mongoose.model("User", UserSchema);