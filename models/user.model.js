import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  projects: [
    {
      slug: String,
      url: String,
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

export default mongoose.model("users", userSchema);
