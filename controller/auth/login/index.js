const vjs = require("validator");
const AppError = require("../../../utils/appError");
const User = require("../../../model/user");
const createCookieAndSend = require("../../../utils/createCookieAndSend");

const login = async (req, res, next) => {
  console.log("login middleware");

  const { email, password } = req.body;

  if (!email || !password)
    return next(
      new AppError("Please provide both 'email' and 'password' !", 400)
    );

  if (!vjs.isEmail(email))
    return next(new AppError("Unvalid email format !", 400));

  const s_email = vjs.normalizeEmail(email);
  const s_password = vjs.escape(password);

  const UserToLogin = await User.findOne({ email: s_email });

  if (!UserToLogin)
    return next(new AppError("Unvalid 'email' or 'password' !", 404));

  const isPasswordCorrect = await UserToLogin.checkPassword(s_password);

  if (!isPasswordCorrect)
    return next(new AppError("Unvalid 'email' or 'password' !", 404));

  const userToSendClient = {
    id: UserToLogin._id,
    username: UserToLogin.username,
    email: UserToLogin.email,
    isVerified: UserToLogin.isVerified,
    newUser: UserToLogin.newUser,
    avatar: UserToLogin.avatar,
    createdAt: UserToLogin.createdAt,
    otpExpires: UserToLogin.otpExpires,
    resetPasswordOtpExpires: UserToLogin.resetPasswordOtpExpires,
    about: UserToLogin.about,
  };

  createCookieAndSend(userToSendClient, res, 200, "Logged in successfully ...");
};

module.exports = login;
