const express = require("express");
const router = express.Router();
const {
  getServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { verifyToken } = require("../middlewares/auth");

router.get("/", getServices);
router.post("/", verifyToken, createService);
router.put("/:id", verifyToken, updateService);
router.delete("/:id", verifyToken, deleteService);

module.exports = router;
