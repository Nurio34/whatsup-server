const User = require("../../../model/user");
const AppError = require("../../../utils/appError");
const createCookieAndSend = require("../../../utils/createCookieAndSend");

const getUser = async (req, res, next) => {
  console.log("getUser function");

  const user = req.user;

  createCookieAndSend(user, res, 200, "User fetched successfully ...");
};

module.exports = getUser;
