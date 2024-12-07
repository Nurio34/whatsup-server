const User = require("../../model/user");
const AppError = require("../../utils/appError");

const updateStatusOnline = async (req, res, next) => {
  const { userId } = req.params;
  console.log("updateStatusOnline");

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      status: "online",
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) next(new AppError("Error while updateStatusOnline", 404));

  return res
    .status(200)
    .json({ status: "success", userStatus: updatedUser.status });
};

module.exports = updateStatusOnline;
