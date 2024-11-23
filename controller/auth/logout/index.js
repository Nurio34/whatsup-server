const node_env = process.env.NODE_ENV;

const logout = (req, res) => {
  console.log("logout function");

  res.cookie("auth-token", "", {
    expires: new Date(Date.now() + cookies_expires_in * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: node_env === "production", // Use secure cookies in production
    sameSite: node_env === "production" ? "none" : "lax", // Use lax for local development
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully ...",
  });
};

module.exports = logout;
