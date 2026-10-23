const { SignJWT, jwtVerify } = require("jose-cjs");

const secretString = process.env.JWT_SECRET || "fallback_default_jwt_secret_portfolio_key_32_characters_minimum";
const secretKey = new TextEncoder().encode(secretString);

async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No authentication token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const { payload } = await jwtVerify(token, secretKey);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
      error: error.message,
    });
  }
}

module.exports = {
  signToken,
  verifyToken,
};
