// server/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePicture: {
      type: String, // path to image file
      default: "",  // or use a default image path like "/uploads/default.png"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
