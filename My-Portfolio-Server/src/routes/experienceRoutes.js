const express = require("express");
const router = express.Router();
const {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");
const { verifyToken } = require("../middlewares/auth");

router.get("/", getExperiences);
router.post("/", verifyToken, createExperience);
router.put("/:id", verifyToken, updateExperience);
router.delete("/:id", verifyToken, deleteExperience);

module.exports = router;
