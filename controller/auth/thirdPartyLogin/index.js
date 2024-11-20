const AppError = require("../../../utils/appError");
const createCookieAndSend = require("../../../utils/createCookieAndSend");
const User = require("../../../model/user");

const thirdPartyLogin = async (req, res, next) => {
    const { username, email, avatar, loginType } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            createCookieAndSend(
                { ...existingUser._doc, isVerified: true },
                res,
                200,
                `Logged in with ${loginType} successfully ...`,
            );
            return;
        }

        const newUser = await User.create({
            username,
            email,
            avatar: { url: avatar },
            newUser: true,
            isVerified: true,
            password: "Loggedinwith_3rdParty",
            passwordConfirm: "Loggedinwith_3rdParty",
        });

        if (!newUser) {
            return next(new AppError("Error while creating new user !"));
        }

        createCookieAndSend(
            newUser,
            res,
            200,
            `Signed up with ${loginType} successfully ...`,
        );
    } catch (error) {
        console.log(error);

        return next(new AppError("Unexpected server error", 500));
    }
};

module.exports = thirdPartyLogin;
