const node_env = process.env.NODE_ENV;

const logout = (req, res) => {
    console.log("logout function");

    res.cookie("auth-token", "LoggedOut", {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    res.status(200).json({
        status: "success",
        message: "Logged out successfully ...",
    });
};

module.exports = logout;
