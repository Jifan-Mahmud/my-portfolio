const express = require("express");
const router = express.Router();
const {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { verifyToken } = require("../middlewares/auth");

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/", verifyToken, createBlog);
router.put("/:id", verifyToken, updateBlog);
router.delete("/:id", verifyToken, deleteBlog);

module.exports = router;
