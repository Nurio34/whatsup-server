const AppError = require("../../../utils/appError");
const User = require("../../../model/user");
const createCookieAndSend = require("../../../utils/createCookieAndSend");

const toggleNewUser = async (req, res, next) => {
  console.log("toggleNewUser function");
  const { id } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        newUser: false,
      },
      { new: true, runValidators: true }
    );

    createCookieAndSend(updatedUser, res, 200, "newUser = false");
  } catch (error) {
    console.log(error);

    return new AppError("Unexpected server error", 500);
  }
};

module.exports = toggleNewUser;
