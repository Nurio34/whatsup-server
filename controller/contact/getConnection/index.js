const User = require("../../../model/user");
const AppError = require("../../../utils/appError");

const getConnection = async (req, res, next) => {
  const { id } = req.params;

  try {
    const connection = await User.findById(id, {
      "avatar.url": 1, // Include only avatar.url
      username: 1, // Include username
      _id: 1, // Include _id (always included by default)
      about: 1,
    });

    if (!connection)
      return next(new AppError("Error while getConnection", 404));

    return res.status(200).json({
      status: "success",
      message: "Here is connection",
      connection,
    });
  } catch (error) {
    return next(new AppError("Server error", 500));
  }
};

module.exports = getConnection;
