const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

async function getServices(req, res, next) {
  try {
    const db = getDB();
    const services = await db.collection("services").find({}).sort({ order: 1 }).toArray();
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    next(error);
  }
}

async function createService(req, res, next) {
  try {
    const { number, title, description, order } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    const db = getDB();
    const newService = {
      number: number || "01",
      title,
      description,
      order: Number(order) || 0,
      createdAt: new Date(),
    };

    const result = await db.collection("services").insertOne(newService);
    newService._id = result.insertedId;

    res.status(201).json({ success: true, message: "Service created successfully", data: newService });
  } catch (error) {
    next(error);
  }
}

async function updateService(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid ID" });

    const db = getDB();
    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData._id;

    const result = await db.collection("services").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) return res.status(404).json({ success: false, message: "Service not found" });
    res.status(200).json({ success: true, message: "Service updated", data: result });
  } catch (error) {
    next(error);
  }
}

async function deleteService(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid ID" });

    const db = getDB();
    const result = await db.collection("services").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, message: "Service not found" });

    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};
