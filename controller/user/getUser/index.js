const User = require("../../../model/user");
const createCookieAndSend = require("../../../utils/createCookieAndSend");

const getUser = async (req, res, next) => {
  console.log("getUser function");

  const user = await User.findById(req.user._id);

  createCookieAndSend(user, res, 200, "User fetched successfully ...");
};

module.exports = getUser;
