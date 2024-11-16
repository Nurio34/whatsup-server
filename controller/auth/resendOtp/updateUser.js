const User = require("../../../model/user");

const updateUser = async (req, res, next) => {
    console.log("updateUser middleware");

    const isForgetPasswordOtp = req.route.path === "/forget-password";

    const user = req.user;

    if (isForgetPasswordOtp) {
        const resetPasswordOtp = req.resetPasswordOtp;
        const resetPasswordOtpExpires = req.resetPasswordOtpExpires;

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                resetPasswordOtp,
                resetPasswordOtpExpires,
            },
            { new: true },
        );

        req.user = updatedUser;
    } else {
        const otp = req.otp;
        const otpExpires = req.otpExpires;

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                otp,
                otpExpires,
            },
            { new: true },
        );
        req.user = updatedUser;
    }

    next();
};

module.exports = updateUser;
