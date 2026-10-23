const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

async function getTestimonials(req, res, next) {
  try {
    const db = getDB();
    const testimonials = await db.collection("testimonials").find({}).sort({ order: 1, createdAt: -1 }).toArray();
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
}

async function createTestimonial(req, res, next) {
  try {
    const { name, role, company, feedback, rating, avatar, order } = req.body;
    if (!name || !feedback) {
      return res.status(400).json({ success: false, message: "Name and feedback are required" });
    }

    const db = getDB();
    const newTestimonial = {
      name,
      role: role || "Client",
      company: company || "",
      feedback,
      rating: Number(rating) || 5,
      avatar: avatar || "",
      order: Number(order) || 0,
      createdAt: new Date(),
    };

    const result = await db.collection("testimonials").insertOne(newTestimonial);
    newTestimonial._id = result.insertedId;

    res.status(201).json({ success: true, message: "Testimonial created", data: newTestimonial });
  } catch (error) {
    next(error);
  }
}

async function updateTestimonial(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid ID" });

    const db = getDB();
    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData._id;

    const result = await db.collection("testimonials").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) return res.status(404).json({ success: false, message: "Testimonial not found" });
    res.status(200).json({ success: true, message: "Testimonial updated", data: result });
  } catch (error) {
    next(error);
  }
}

async function deleteTestimonial(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid ID" });

    const db = getDB();
    const result = await db.collection("testimonials").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, message: "Testimonial not found" });

    res.status(200).json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
