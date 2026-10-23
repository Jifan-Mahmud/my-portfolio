const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

async function getExperiences(req, res, next) {
  try {
    const db = getDB();
    const items = await db.collection("experiences").find({}).sort({ order: 1, startDate: -1 }).toArray();
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
}

async function createExperience(req, res, next) {
  try {
    const { title, organization, type, period, description, order } = req.body;
    if (!title || !organization) {
      return res.status(400).json({ success: false, message: "Title and organization are required" });
    }

    const db = getDB();
    const newItem = {
      title,
      organization,
      type: type || "Education", // Education, Experience, Training
      period: period || "2022 - Present",
      description: description || "",
      order: Number(order) || 0,
      createdAt: new Date(),
    };

    const result = await db.collection("experiences").insertOne(newItem);
    newItem._id = result.insertedId;

    res.status(201).json({ success: true, message: "Experience added successfully", data: newItem });
  } catch (error) {
    next(error);
  }
}

async function updateExperience(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const db = getDB();
    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData._id;

    const result = await db.collection("experiences").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) return res.status(404).json({ success: false, message: "Item not found" });
    res.status(200).json({ success: true, message: "Experience updated", data: result });
  } catch (error) {
    next(error);
  }
}

async function deleteExperience(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const db = getDB();
    const result = await db.collection("experiences").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, message: "Item not found" });

    res.status(200).json({ success: true, message: "Experience deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
};
