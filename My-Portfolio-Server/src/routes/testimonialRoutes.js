const express = require("express");
const router = express.Router();
const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const { verifyToken } = require("../middlewares/auth");

router.get("/", getTestimonials);
router.post("/", verifyToken, createTestimonial);
router.put("/:id", verifyToken, updateTestimonial);
router.delete("/:id", verifyToken, deleteTestimonial);

module.exports = router;
