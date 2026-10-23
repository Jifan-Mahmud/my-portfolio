const bcrypt = require("bcryptjs");
const { getDB } = require("../config/db");
const { signToken } = require("../middlewares/auth");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const trimmedPassword = String(password).trim();

    const db = getDB();
    const adminUser = await db.collection("users").findOne({ email: trimmedEmail });

    const envAdminEmail = (process.env.ADMIN_EMAIL || "admin@jifanmahmud.com").trim().toLowerCase();
    const envAdminPassword = (process.env.ADMIN_PASSWORD || "").trim();

    let isMatch = false;

    if (adminUser && adminUser.password) {
      isMatch = await bcrypt.compare(trimmedPassword, adminUser.password);
    }

    // Fallback: If not matched via hash but matches env ADMIN_PASSWORD
    if (!isMatch && trimmedEmail === envAdminEmail && envAdminPassword && trimmedPassword === envAdminPassword) {
      isMatch = true;
      // Re-hash and update in DB so next login works directly with bcrypt
      const newHash = await bcrypt.hash(trimmedPassword, 10);
      await db.collection("users").updateOne(
        { email: trimmedEmail },
        {
          $set: {
            password: newHash,
            name: adminUser?.name || "B.M. Jifan Mahmud",
            role: "admin",
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = await signToken({
      email: trimmedEmail,
      role: "admin",
      name: adminUser?.name || "B.M. Jifan Mahmud",
    });

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        email: trimmedEmail,
        name: adminUser?.name || "B.M. Jifan Mahmud",
        role: "admin",
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  getMe,
};
