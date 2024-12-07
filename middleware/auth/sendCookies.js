const createCookieAndSend = require("../../utils/createCookieAndSend");

const sendCookies = (req, res) => {
  const user = req.user;

  const isForgetPassword = req.route.path === "/forget-password";
  res.isForgetPassword = isForgetPassword;

  user.password = "";
  user.passwordConfirm = "";
  user.otp = "";

  const isResendOtp = req.route.path === "/resend-otp";

  const userToSendClient = {
    id: user._id,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
    newUser: user.newUser,
    avatar: user.avatar,
    createdAt: user.createdAt,
    otpExpires: user.otpExpires,
    resetPasswordOtpExpires: user.resetPasswordOtpExpires,
    about: user.about,
    status: user.status,
  };

  createCookieAndSend(
    userToSendClient,
    res,
    200,
    isResendOtp ? "New OTP's been sent" : "OTP has been send to your email ..."
  );
};

module.exports = sendCookies;
