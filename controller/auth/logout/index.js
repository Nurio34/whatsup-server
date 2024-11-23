const node_env = process.env.NODE_ENV;
const cookies_expires_in = process.env.COOKIES_EXPIRES_IN;

const logout = (req, res) => {
  console.log("logout function");

  res.cookie("auth-token", "", {
    expires: new Date(Date.now() + cookies_expires_in * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: node_env === "production", // Secure cookies in production
    sameSite: node_env === "production" ? "none" : "lax", // SameSite for local development
    domain:
      node_env === "production" ? "whatsup-lime-rho.vercel.app" : undefined, // Avoid domain setting in localhost
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully ...",
  });
};

module.exports = logout;
