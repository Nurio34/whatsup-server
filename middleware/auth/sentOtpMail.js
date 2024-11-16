const User = require("../../model/user");
const AppError = require("../../utils/appError");

const nodemailer = require("nodemailer");
const gmail_auth_user = process.env.GMAIL_AUTH_USER;
const gmail_auth_pass = process.env.GMAIL_AUTH_PASS;
const mail_from = process.env.MAIL_FROM;

const sendOtpMail = async (req, res, next) => {
    console.log("sendOtpMail middleware ...");
    const isResendOtp = req.route.path === "/resend-otp";
    const isForgetPasswordOtp = req.route.path === "/forget-password";

    const otp = isForgetPasswordOtp ? req.user.resetPasswordOtp : req.user.otp;

    const to = req.user.email;

    const subject = isResendOtp
        ? "Your new OTP for mail verification"
        : isForgetPasswordOtp
        ? "Your OTP for forgotten password"
        : "OTP for mail verification";
    const html = isResendOtp
        ? `
        <h1>Your new OTP is below</h1>
        <p>${otp}</p>
    `
        : `
        <h1>Your OTP is below</h1>
        <p>${otp}</p>
    `;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: gmail_auth_user,
            pass: gmail_auth_pass,
        },
    });

    const mailOptions = {
        from: `${mail_from} <${gmail_auth_user}>`,
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);

        next();
    } catch (error) {
        console.log(error);

        next(new AppError("Verification email sending failed !", 500));

        if (isForgetPasswordOtp)
            return await User.findByIdAndUpdate(req.user._id, {
                otp: null,
                otpExpires: null,
            });
        return await User.findByIdAndDelete(req.user._id);
    }
};

module.exports = sendOtpMail;
