const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

async function getProjects(req, res, next) {
  try {
    const db = getDB();
    const { featured, category } = req.query;
    const query = {};

    if (featured === "true") {
      query.featured = true;
    }
    if (category && category !== "All") {
      query.category = category;
    }

    const projects = await db
      .collection("projects")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
}

async function getProjectById(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid project ID" });
    }

    const db = getDB();
    const project = await db.collection("projects").findOne({ _id: new ObjectId(id) });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

async function createProject(req, res, next) {
  try {
    const {
      title,
      description,
      details,
      image,
      liveLink,
      githubLink,
      githubServerLink,
      techStack,
      featured,
      category,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required.",
      });
    }

    const db = getDB();
    const newProject = {
      title,
      description,
      details: details || description,
      image: image || "/assets/placeholder-project.jpg",
      liveLink: liveLink || "",
      githubLink: githubLink || "",
      githubServerLink: githubServerLink || "",
      techStack: Array.isArray(techStack)
        ? techStack
        : typeof techStack === "string"
        ? techStack.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      featured: Boolean(featured),
      category: category || "Full-Stack",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("projects").insertOne(newProject);
    newProject._id = result.insertedId;

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: newProject,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid project ID" });
    }

    const db = getDB();
    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData._id;

    if (updateData.techStack && typeof updateData.techStack === "string") {
      updateData.techStack = updateData.techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const result = await db.collection("projects").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid project ID" });
    }

    const db = getDB();
    const result = await db.collection("projects").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
