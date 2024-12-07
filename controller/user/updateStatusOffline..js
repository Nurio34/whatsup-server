const User = require("../../model/user");
const AppError = require("../../utils/appError");

const updateStatusOffline = async (req, res, next) => {
  const { userId } = req.params;
  console.log("updateStatusOffline");

  const updatedUser = await User.findByIdAndUpdate(userId, {
    status: "offline",
  });

  if (!updatedUser) next(new AppError("Error while updateStatusOffline"), 404);

  return res
    .status(200)
    .json({ status: "success", userStatus: updatedUser.status });
};

module.exports = updateStatusOffline;
