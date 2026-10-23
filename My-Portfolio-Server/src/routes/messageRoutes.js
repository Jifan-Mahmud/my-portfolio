const express = require("express");
const router = express.Router();
const {
  submitMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} = require("../controllers/messageController");
const { verifyToken } = require("../middlewares/auth");
const { contactLimiter } = require("../middlewares/rateLimiter");

// Public contact submission with rate limiting
router.post("/", contactLimiter, submitMessage);

// Admin endpoints
router.get("/", verifyToken, getMessages);
router.patch("/:id/read", verifyToken, markAsRead);
router.delete("/:id", verifyToken, deleteMessage);

module.exports = router;
