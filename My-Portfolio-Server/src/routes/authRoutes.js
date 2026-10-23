const express = require("express");
const router = express.Router();
const { login, getMe } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/auth");
const { loginLimiter } = require("../middlewares/rateLimiter");

// Admin login route with rate limiting
router.post("/login", loginLimiter, login);

// Protected route to check token validity
router.get("/me", verifyToken, getMe);

module.exports = router;
