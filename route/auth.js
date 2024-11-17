const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const checkIfEmailAlreadyRegistered = require("../controller/auth/signup/checkIfEmailAlreadyRegistered");
const createOtp = require("../middleware/auth/createOtp");
const createNewUser = require("../controller/auth/signup/createNewUser");
const sendOtpMail = require("../middleware/auth/sentOtpMail");
const sendCookies = require("../middleware/auth/sendCookies");
const checkAuthentication = require("../middleware/auth/checkAuthentication");
const verifyOtp = require("../controller/auth/verifyEmail/verifyOtp");
const checkEmail = require("../controller/auth/resendOtp/checkEmail");
const updateUser = require("../controller/auth/resendOtp/updateUser");
const login = require("../controller/auth/login");
const logout = require("../controller/auth/logout");
const checkIfAccountExists = require("../controller/auth/forgetPassword/checkIfAccountExists");
const resetPassword = require("../controller/auth/resetPassword");
const googleLogin = require("../controller/auth/googleLogin");

router.post(
    "/signup",
    catchAsync(checkIfEmailAlreadyRegistered),
    createOtp,
    catchAsync(createNewUser),
    catchAsync(sendOtpMail),
    sendCookies,
);

router.post(
    "/verify-email",
    catchAsync(checkAuthentication),
    catchAsync(verifyOtp),
);

router.post(
    "/resend-otp",
    catchAsync(checkEmail),
    createOtp,
    catchAsync(updateUser),
    catchAsync(sendOtpMail),
    sendCookies,
);

router.post("/login", catchAsync(login));

router.post("/logout", logout);

router.post(
    "/forget-password",
    catchAsync(checkIfAccountExists),
    createOtp,
    catchAsync(updateUser),
    catchAsync(sendOtpMail),
    sendCookies,
);

router.post("/reset-password", catchAsync(resetPassword));

router.post("/google-login", catchAsync(googleLogin));

module.exports = router;
