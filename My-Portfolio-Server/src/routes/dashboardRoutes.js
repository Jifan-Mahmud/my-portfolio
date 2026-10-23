const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardController");
const { verifyToken } = require("../middlewares/auth");

router.get("/stats", verifyToken, getDashboardStats);

module.exports = router;
