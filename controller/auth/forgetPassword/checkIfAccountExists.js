const User = require("../../../model/user");
const AppError = require("../../../utils/appError");
const vjs = require("validator");

const checkIfAccountExists = async (req, res, next) => {
    const { email } = req.body;

    if (!email || email.trim() === "" || !vjs.isEmail(email))
        return next(new AppError("Please provide your email !", 400));

    const user = await User.findOne({ email });

    if (!user)
        return next(
            new AppError("There is not an account with this email !", 404),
        );

    req.user = user;
    next();
};

module.exports = checkIfAccountExists;
