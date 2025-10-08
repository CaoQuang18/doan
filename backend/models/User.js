const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Plain text password (no hashing)
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profilePicture: { type: String, default: "" },
  address: { type: String, default: "" },
  dateOfBirth: { type: String, default: "" }
}, { timestamps: true });

// DISABLED: Password hashing - Store plain text for admin visibility
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// Compare plain text password
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Plain text comparison instead of bcrypt
  return this.password === candidatePassword;
};

module.exports = mongoose.model("User", userSchema, "user"); // Force collection name to "user"