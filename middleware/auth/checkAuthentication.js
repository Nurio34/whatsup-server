const AppError = require("../../utils/appError");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;
const User = require("../../model/user");

const checkAuthentication = async (req, res, next) => {
  console.log("checkAuthentication middleware");

  try {
    const authHeader = req.headers.authorization;
    const cookiesToken = req.cookies["auth-token"];

    if (!cookiesToken && !authHeader) {
      return next(new AppError("Token not found. Please login!", 401));
    }

    const token = authHeader?.split(" ")[1] || cookiesToken;

    // Verify the token
    const decoded = jwt.verify(token, jwt_secret);

    // Fetch user from the database
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError("User not found. Token is invalid!", 401));
    }

    // Attach user to the request object
    req.user = user;

    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      console.log("Invalid token. Please login again!");

      return next(new AppError("Invalid token. Please login again!", 401));
    }
    if (error.name === "TokenExpiredError") {
      console.log("Token expired. Please login again!");

      return next(new AppError("Token expired. Please login again!", 401));
    }

    // Handle unexpected errors
    console.log("Authentication failed. Please try again.");

    return next(new AppError("Authentication failed. Please try again.", 500));
  }
};

module.exports = checkAuthentication;
