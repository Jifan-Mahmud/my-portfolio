const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { verifyToken } = require("../middlewares/auth");

// Public endpoints
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Admin-only protected endpoints
router.post("/", verifyToken, createProject);
router.put("/:id", verifyToken, updateProject);
router.delete("/:id", verifyToken, deleteProject);

module.exports = router;
