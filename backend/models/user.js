import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // enforce some strength
    }
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export const User = mongoose.model("User", userSchema);
