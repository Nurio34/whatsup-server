const AppError = require("../../../utils/appError");
const createCookieAndSend = require("../../../utils/createCookieAndSend");
const User = require("../../../model/user");

const thirdPartyLogin = async (req, res, next) => {
    const { username, email, avatar } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        createCookieAndSend(
            existingUser,
            res,
            200,
            "Logged id with 'Google' successfully ...",
        );
        return;
    }

    const newUser = await User.create({
        username,
        email,
        avatar,
        newUser: true,
        isVerified: true,
        password: "Logwith_3rdParty",
        passwordConfirm: "Logwith_3rdParty",
    });

    createCookieAndSend(
        newUser,
        res,
        200,
        "Signed up with 'Google' successfully ...",
    );
};

module.exports = thirdPartyLogin;
