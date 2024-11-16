const User = require("../../../model/user");
const AppError = require("../../../utils/appError");

const createNewUser = async (req, res, next) => {
    console.log("createNewUser middleware ...");
    const { username, email, password, passwordConfirm } = req.body;
    const { otp, otpExpires } = req;

    const NewUser = new User({
        username,
        email,
        password,
        passwordConfirm,
        otp,
        otpExpires,
    });

    await NewUser.save();

    if (!NewUser) {
        next(
            new AppError(
                "An error occured while getting your data. Please try again !",
                500,
            ),
        );
    }

    req.user = NewUser;
    next();
};

module.exports = createNewUser;
