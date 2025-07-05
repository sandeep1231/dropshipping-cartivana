const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLES } = require("./enums");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: Object.values(ROLES), default: ROLES.CUSTOMER }
}, { timestamps: true });

/**
 * Hash the password before saving the user document.
 * @param {import('mongoose').HookNextFunction} next
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compare entered password with hashed password.
 * @param {string} enteredPassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
