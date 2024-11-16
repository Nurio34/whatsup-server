const AppError = require("../../utils/appError");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;
const User = require("../../model/user");

const checkAuthentication = async (req, res, next) => {
    console.log("checkAuthentication middleware");

    const authHeader = req.headers.authorization;
    const cookiesToken = req.cookies["auth-token"];

    if (!cookiesToken && !authHeader)
        return next(new AppError("There is not a token !", 401));

    const token = authHeader?.split(" ")[1] || cookiesToken;

    const { id } = jwt.verify(token, jwt_secret);

    const user = await User.findById(id);

    if (!user) return next(new AppError("Token is broken !", 400));

    req.user = user;
    next();
};

module.exports = checkAuthentication;
