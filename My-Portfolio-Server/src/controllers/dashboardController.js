const { getDB } = require("../config/db");

async function getDashboardStats(req, res, next) {
  try {
    const db = getDB();

    const [
      totalProjects,
      totalSkills,
      totalMessages,
      unreadMessages,
      totalExperiences,
      totalServices,
      totalBlogs,
      totalTestimonials,
      totalCertificates,
      recentMessages,
    ] = await Promise.all([
      db.collection("projects").countDocuments(),
      db.collection("skills").countDocuments(),
      db.collection("messages").countDocuments(),
      db.collection("messages").countDocuments({ read: false }),
      db.collection("experiences").countDocuments(),
      db.collection("services").countDocuments(),
      db.collection("blogs").countDocuments(),
      db.collection("testimonials").countDocuments(),
      db.collection("certificates").countDocuments(),
      db.collection("messages").find({}).sort({ createdAt: -1 }).limit(5).toArray(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        totalSkills,
        totalMessages,
        unreadMessages,
        totalExperiences,
        totalServices,
        totalBlogs,
        totalTestimonials,
        totalCertificates,
        recentMessages,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardStats,
};
