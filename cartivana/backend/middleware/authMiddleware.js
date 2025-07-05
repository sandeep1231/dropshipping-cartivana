const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to protect routes and require authentication.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
  }
};

/**
 * Middleware to check if user is admin.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};

module.exports = { protect, isAdmin };
