const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

async function getSkills(req, res, next) {
  try {
    const db = getDB();
    const skills = await db.collection("skills").find({}).sort({ order: 1, name: 1 }).toArray();

    // Also offer categorized structure
    const categorized = {
      Frontend: [],
      Backend: [],
      Database: [],
      Tools: [],
    };

    skills.forEach((skill) => {
      const cat = skill.category || "Frontend";
      if (!categorized[cat]) {
        categorized[cat] = [];
      }
      categorized[cat].push(skill);
    });

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
      categorized,
    });
  } catch (error) {
    next(error);
  }
}

async function createSkill(req, res, next) {
  try {
    const { name, category, icon, level, order } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Skill name and category are required.",
      });
    }

    const db = getDB();
    const newSkill = {
      name,
      category,
      icon: icon || "Code",
      level: Number(level) || 85,
      order: Number(order) || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("skills").insertOne(newSkill);
    newSkill._id = result.insertedId;

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: newSkill,
    });
  } catch (error) {
    next(error);
  }
}

async function updateSkill(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid skill ID" });
    }

    const db = getDB();
    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData._id;

    if (updateData.level) updateData.level = Number(updateData.level);
    if (updateData.order) updateData.order = Number(updateData.order);

    const result = await db.collection("skills").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteSkill(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid skill ID" });
    }

    const db = getDB();
    const result = await db.collection("skills").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};
