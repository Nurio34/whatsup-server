const { uploadAvatar } = require("../../../cloudinary");
const User = require("../../../model/user");
const AppError = require("../../../utils/appError");

const createProfile = async (req, res, next) => {
  const { id, name, about } = req.body;
  const { path } = req.file;

  const { url, public_id, asset_id } = await uploadAvatar(path);

  const user = await User.findByIdAndUpdate(
    id,
    {
      username: name,
      about,
      newUser: false,
      avatar: {
        url,
        public_id,
        asset_id,
      },
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(
      new AppError(
        "Something went wrong while creating proile. Please try again !"
      )
    );
  }

  const userToSendClient = {
    id: user.id,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
    newUser: user.newUser,
    avatar: user.avatar,
    createdAt: user.createdAt,
    about: user.about,
    status: user.status,
  };

  console.log(userToSendClient);

  return res.status(200).json({
    status: "success",
    message: "Profile created successfully ...",
    user: userToSendClient,
  });
};

module.exports = createProfile;
