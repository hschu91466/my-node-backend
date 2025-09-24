import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    imagePosition: {
      type: String,
      default: "center",
    },
    imageSize: {
      type: String,
      default: "medium",
    },
    imageVerticalOffset: {
      type: Number,
      default: 0,
    },
    imageHorizontalOffset: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
