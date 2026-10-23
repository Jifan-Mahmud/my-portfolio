const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, downloadResume } = require("../controllers/profileController");
const { verifyToken } = require("../middlewares/auth");

router.get("/", getProfile);
router.get("/resume", downloadResume);
router.put("/", verifyToken, updateProfile);

module.exports = router;
