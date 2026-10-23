const express = require("express");
const router = express.Router();
const {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require("../controllers/certificateController");
const { verifyToken } = require("../middlewares/auth");

router.get("/", getCertificates);
router.get("/:id", getCertificateById);
router.post("/", verifyToken, createCertificate);
router.put("/:id", verifyToken, updateCertificate);
router.delete("/:id", verifyToken, deleteCertificate);

module.exports = router;
