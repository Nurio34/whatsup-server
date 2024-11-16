const User = require("../../../model/user");
const AppError = require("../../../utils/appError");

const checkIfEmailAlreadyRegistered = async (req, res, next) => {
    console.log("checkIfEmailAlreadyRegistered middleware ...");

    const { email } = req.body;

    if (!email || email.trim("") === "") {
        return next(new AppError("Please write your email !", 400));
    }

    const check = await User.findOne({ email });

    if (check)
        return next(
            new AppError("This email has been already registered !", 400),
        );

    next();
};

module.exports = checkIfEmailAlreadyRegistered;
