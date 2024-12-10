const User = require("../../../model/user");
const AppError = require("../../../utils/appError");

const findUser = async (req, res, next) => {
  console.log("findUser function ...");
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select(
      "avatar.url _id username"
    );

    if (!user) return next(new AppError("Error while findUser() !", 404));

    return res.status(200).json({
      status: "success",
      message: "User fetched successfully.",
      user,
    });
  } catch (error) {
    return next(new AppError("Server error while findUser() !", 500));
  }
};

module.exports = findUser;
