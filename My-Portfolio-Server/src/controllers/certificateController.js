const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const DEFAULT_CERTIFICATES = [
  {
    title: "Complete Web Development Course with Jhankar Mahbub",
    issuer: "Programming Hero",
    issueDate: "December 2024",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    pdfUrl: "https://web.programming-hero.com/certificate/PH-WD-2024-8841.pdf",
    pdfFileName: "Programming_Hero_Web_Dev.pdf",
    skills: ["React.js", "Next.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    description: "6-month intensive full-stack program mastering modern JavaScript, React 19, Next.js App Router, Express REST APIs, MongoDB, JWT authentication, and production deployments.",
    order: 1,
  },
  {
    title: "Diploma in Engineering (Computer Science & Technology)",
    issuer: "Barisal Polytechnic Institute",
    issueDate: "2024",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    pdfUrl: "",
    pdfFileName: "",
    skills: ["Data Structures", "Algorithms", "Database Systems", "Software Engineering"],
    description: "4-year engineering curriculum establishing strong foundations in software design, object-oriented programming, data structures, database architecture, and computer networking.",
    order: 2,
  },
  {
    title: "JavaScript Algorithms & Data Structures Specialization",
    issuer: "freeCodeCamp",
    issueDate: "October 2024",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    pdfUrl: "https://www.freecodecamp.org/certification/jifanmahmud/javascript-algorithms-and-data-structures.pdf",
    pdfFileName: "freeCodeCamp_JS_Algorithms.pdf",
    skills: ["JavaScript (ES6+)", "OOP", "Functional Programming", "Algorithm Scripting"],
    description: "In-depth validation of algorithmic thinking, data structures, recursion, higher-order functions, and ES6+ modern JavaScript standards.",
    order: 3,
  },
];

async function getCertificates(req, res, next) {
  try {
    const db = getDB();
    const certificates = await db
      .collection("certificates")
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    if (!certificates || certificates.length === 0) {
      // Seed default sample certificates if collection is empty
      const docsToInsert = DEFAULT_CERTIFICATES.map((c) => ({
        ...c,
        createdAt: new Date(),
      }));
      await db.collection("certificates").insertMany(docsToInsert);
      const seeded = await db
        .collection("certificates")
        .find({})
        .sort({ order: 1, createdAt: -1 })
        .toArray();
      return res.status(200).json({ success: true, count: seeded.length, data: seeded });
    }

    res.status(200).json({ success: true, count: certificates.length, data: certificates });
  } catch (error) {
    next(error);
  }
}

async function getCertificateById(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Certificate ID" });
    }

    const db = getDB();
    const cert = await db.collection("certificates").findOne({ _id: new ObjectId(id) });
    if (!cert) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.status(200).json({ success: true, data: cert });
  } catch (error) {
    next(error);
  }
}

async function createCertificate(req, res, next) {
  try {
    const { title, issuer, issueDate, image, pdfUrl, pdfFileName, pdfFileSize, skills, description, order } = req.body;
    if (!title || !issuer) {
      return res.status(400).json({ success: false, message: "Title and Issuer are required" });
    }

    const db = getDB();
    const newCert = {
      title,
      issuer,
      issueDate: issueDate || "",
      image: image || "",
      pdfUrl: pdfUrl || "",
      pdfFileName: pdfFileName || "",
      pdfFileSize: pdfFileSize || "",
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(",").map(s => s.trim()) : []),
      description: description || "",
      order: Number(order) || 0,
      createdAt: new Date(),
    };

    const result = await db.collection("certificates").insertOne(newCert);
    newCert._id = result.insertedId;

    res.status(201).json({ success: true, message: "Certificate created successfully", data: newCert });
  } catch (error) {
    next(error);
  }
}

async function updateCertificate(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Certificate ID" });
    }

    const db = getDB();
    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData._id;

    // Clean up deprecated fields if present
    delete updateData.credentialId;
    delete updateData.verifyUrl;

    if (updateData.skills && typeof updateData.skills === "string") {
      updateData.skills = updateData.skills.split(",").map(s => s.trim());
    }

    const result = await db.collection("certificates").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: updateData,
        $unset: { credentialId: "", verifyUrl: "" }
      },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.status(200).json({ success: true, message: "Certificate updated successfully", data: result });
  } catch (error) {
    next(error);
  }
}

async function deleteCertificate(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Certificate ID" });
    }

    const db = getDB();
    const result = await db.collection("certificates").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.status(200).json({ success: true, message: "Certificate deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  DEFAULT_CERTIFICATES,
};
