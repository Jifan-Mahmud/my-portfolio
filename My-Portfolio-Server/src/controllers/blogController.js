const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

async function getBlogs(req, res, next) {
  try {
    const db = getDB();
    const blogs = await db.collection("blogs").find({}).sort({ createdAt: -1 }).toArray();
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    next(error);
  }
}

async function getBlogById(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid ID" });

    const db = getDB();
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
}

async function createBlog(req, res, next) {
  try {
    const { title, excerpt, content, coverImage, tags, readTime } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    const db = getDB();
    const newBlog = {
      title,
      excerpt: excerpt || content.substring(0, 150) + "...",
      content,
      coverImage: coverImage || "",
      tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map(t => t.trim()) : [],
      readTime: readTime || "5 min read",
      author: "B.M. Jifan Mahmud",
      createdAt: new Date(),
    };

    const result = await db.collection("blogs").insertOne(newBlog);
    newBlog._id = result.insertedId;

    res.status(201).json({ success: true, message: "Blog created successfully", data: newBlog });
  } catch (error) {
    next(error);
  }
}

async function updateBlog(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid ID" });

    const db = getDB();
    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData._id;

    if (updateData.tags && typeof updateData.tags === "string") {
      updateData.tags = updateData.tags.split(",").map(t => t.trim());
    }

    const result = await db.collection("blogs").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) return res.status(404).json({ success: false, message: "Blog not found" });
    res.status(200).json({ success: true, message: "Blog updated", data: result });
  } catch (error) {
    next(error);
  }
}

async function deleteBlog(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid ID" });

    const db = getDB();
    const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, message: "Blog not found" });

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
