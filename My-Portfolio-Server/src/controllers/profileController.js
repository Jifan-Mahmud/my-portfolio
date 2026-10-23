const { getDB } = require("../config/db");

async function getProfile(req, res, next) {
  try {
    const db = getDB();
    let profile = await db.collection("profile").findOne({});

    if (!profile) {
      // Default initial profile
      profile = {
        name: "B.M. Jifan Mahmud",
        role: "Full-Stack Web Developer",
        bio: "Passionate Full-Stack Web Developer skilled in React.js, Next.js, Node.js, Express.js, and MongoDB. Committed to crafting high-performance, responsive web applications with exceptional user experiences.",
        aboutJourney: "Graduated with a Diploma in Engineering in Computer Science and Technology (CST) from Barisal Polytechnic Institute. Advanced my skills through rigorous web development training at Programming Hero and People N Tech. Passionate about modern web technologies and building impactful products.",
        education: "Diploma in Engineering, Computer Science and Technology (CST), Barisal Polytechnic Institute",
        photoUrl: "/assets/jifan1.png",
        resumeUrl: "https://drive.google.com/file/d/your-resume-id/view?usp=sharing",
        email: "jifanmahmud@gmail.com",
        phone: "+880 1700-000000",
        location: "Barisal, Bangladesh",
        availability: "Available for new opportunities",
        socialLinks: {
          github: "https://github.com",
          linkedin: "https://linkedin.com",
          twitter: "https://x.com",
          facebook: "https://facebook.com",
        },
        stats: {
          projectsCompleted: "15+",
          satisfiedClients: "10+",
          yearsExperience: "2+",
          contributions: "350+",
        },
      };
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const db = getDB();
    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData._id;

    const result = await db.collection("profile").updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );

    const updatedProfile = await db.collection("profile").findOne({});
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
}

async function downloadResume(req, res, next) {
  try {
    const db = getDB();
    const profile = await db.collection("profile").findOne({});

    if (!profile || !profile.resumeUrl) {
      return res.status(404).json({ success: false, message: "Resume not found." });
    }

    const resumeUrl = profile.resumeUrl;
    const fileName = profile.resumeFileName || "B.M.Jifan_Mahmud_Resume.pdf";

    // If it's a Base64 data URL, stream as direct binary file
    if (resumeUrl.startsWith("data:")) {
      const matches = resumeUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ success: false, message: "Invalid resume format." });
      }

      const contentType = matches[1];
      const buffer = Buffer.from(matches[2], "base64");

      res.setHeader("Content-Type", contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(fileName)}"`
      );
      res.setHeader("Content-Length", buffer.length);
      return res.send(buffer);
    }

    // If it's an external URL (Google Drive, etc.), redirect to it
    return res.redirect(resumeUrl);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  downloadResume,
};
