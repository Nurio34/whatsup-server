const AppError = require("../../../utils/appError");
const User = require("../../../model/user");
const createCookieAndSend = require("../../../utils/createCookieAndSend");

const verifyOtp = async (req, res, next) => {
    console.log("verifyOtp middleware");

    const user = req.user;
    const { otp } = req.body;
    const userOtp = user.otp;
    const otpExpires = user.otpExpires;

    if (!otp) return next(new AppError("Otp is missing !", 400));

    if (otp.length < 4)
        return next(new AppError("Otp must be at leat 'four' number !", 400));

    if (otp !== userOtp) return next(new AppError("Invalid Otp", 400));

    if (Date.now() > otpExpires)
        return next(
            new AppError("Otp has expired. Please request new Otp !", 400),
        );

    const verifiedUser = await User.findByIdAndUpdate(
        user._id,
        {
            isVerified: true,
            $unset: {
                passwordConfirm: "",
                otp: "",
                otpExpires: "",
            },
        },
        { new: true },
    );

    if (!verifiedUser) return next(new AppError("User not found !", 404));

    createCookieAndSend(
        verifiedUser,
        res,
        200,
        "Email is verified successfully ...",
    );
};

module.exports = verifyOtp;
