const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

async function submitMessage(req, res, next) {
  try {
    const trimmedName = String(name || "").trim().slice(0, 100);
    const trimmedEmail = String(email || "").trim().toLowerCase().slice(0, 120);
    const trimmedSubject = String(subject || "Portfolio Contact Inquiry").trim().slice(0, 200);
    const trimmedMessage = String(message || "").trim().slice(0, 5000);

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const db = getDB();
    const newMessage = {
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
      read: false,
      createdAt: new Date(),
    };

    const result = await db.collection("messages").insertOne(newMessage);
    newMessage._id = result.insertedId;

    res.status(201).json({
      success: true,
      message: "Thank you! Your message has been received successfully.",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
}

async function getMessages(req, res, next) {
  try {
    const db = getDB();
    const messages = await db
      .collection("messages")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const unreadCount = messages.filter((m) => !m.read).length;

    res.status(200).json({
      success: true,
      count: messages.length,
      unreadCount,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
}

async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid message ID" });
    }

    const db = getDB();
    const message = await db.collection("messages").findOne({ _id: new ObjectId(id) });

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    const updated = await db.collection("messages").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { read: !message.read, readAt: new Date() } },
      { returnDocument: "after" }
    );

    res.status(200).json({
      success: true,
      message: "Message status updated",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteMessage(req, res, next) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid message ID" });
    }

    const db = getDB();
    const result = await db.collection("messages").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitMessage,
  getMessages,
  markAsRead,
  deleteMessage,
};
