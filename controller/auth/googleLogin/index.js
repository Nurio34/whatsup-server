const AppError = require("../../../utils/appError");
const createCookieAndSend = require("../../../utils/createCookieAndSend");
const prisma = require("../../../utils/prismaClient");

const googleLogin = async (req, res, next) => {
    const { username, email, avatar } = req.body;

    console.log({ username, email, avatar });

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        createCookieAndSend(
            existingUser,
            res,
            200,
            "Logged id with 'Google' successfully ...",
        );
    }

    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            avatar,
        },
    });

    createCookieAndSend(
        newUser,
        res,
        200,
        "Signed up with 'Google' successfully ...",
    );
};

module.exports = googleLogin;
