const User = require("../models/User");

/**
 * Get the profile of the current user.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};

/**
 * Get all users (admin only).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

/**
 * Delete a user by ID (admin only).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};
