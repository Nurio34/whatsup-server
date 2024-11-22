const User = require("../../../model/user");
const AppError = require("../../../utils/appError");

const getAllUsers = async (req, res, next) => {
  console.log("getAllUsers function ...");

  try {
    const users = await User.find().select("avatar.url _id username");

    if (!users || users.length === 0)
      return next(new AppError("Error while getAllusers() !", 404));

    return res.status(200).json({
      status: "success",
      message: "Users fetched successfully.",
      users,
    });
  } catch (error) {
    return next(new AppError("Server error while getAllusers() !", 500));
    console.log(error);
  }
};

module.exports = getAllUsers;
