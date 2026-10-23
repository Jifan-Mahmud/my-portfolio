const express = require("express");
const router = express.Router();
const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");
const { verifyToken } = require("../middlewares/auth");

router.get("/", getSkills);
router.post("/", verifyToken, createSkill);
router.put("/:id", verifyToken, updateSkill);
router.delete("/:id", verifyToken, deleteSkill);

module.exports = router;
