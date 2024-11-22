const User = require("../../../model/user");
const AppError = require("../../../utils/appError");
const createCookieAndSend = require("../../../utils/createCookieAndSend");

const getUser = async (req, res, next) => {
  console.log("getUser function");

  const { id } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) return next(new AppError("User not found !", 404));

    createCookieAndSend(user, res, 200, "User fetched successfully ...");
  } catch (error) {
    console.log(error);
    next(new AppError("Unexpected server error !", 500));
  }
};

module.exports = getUser;
