const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");

    // Check if token exists
    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // Remove "Bearer " if included
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    // Verify token
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "SECRET_KEY"
    );

    // Save decoded user info
    req.user = verified;

    next();

  } catch (err) {
    console.error(err);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};