const createOTP = async (req, res, next) => {
    console.log("createOtp middleware ...");

    const isForgetPasswordOtp = req.route.path === "/forget-password";

    const otp = Math.floor(Math.random() * 9000 + 1000);
    const otpExpires = Date.now() + 2 * 60 * 1000;

    if (isForgetPasswordOtp) {
        req.resetPasswordOtp = otp;
        req.resetPasswordOtpExpires = otpExpires;
    } else {
        req.otp = otp;
        req.otpExpires = otpExpires;
    }

    next();
};

module.exports = createOTP;
