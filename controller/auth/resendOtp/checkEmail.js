const vjs = require("validator");
const AppError = require("../../../utils/appError");
const User = require("../../../model/user");

const checkEmail = async (req, res, next) => {
    console.log("checkEmail middleware");

    const { email } = req.body;

    if (!vjs.isEmail(email))
        return next(new AppError("Not a valid email", 400));

    const s_email = vjs.normalizeEmail(email);

    const RegisteredUserByThisEmail = await User.findOne({ email: s_email });

    if (!RegisteredUserByThisEmail)
        return next(
            new AppError("There is not an account with this email !", 404),
        );

    if (RegisteredUserByThisEmail.isVerified)
        return next(new AppError("This account is already verified !", 400));

    req.user = RegisteredUserByThisEmail;
    next();
};

module.exports = checkEmail;
