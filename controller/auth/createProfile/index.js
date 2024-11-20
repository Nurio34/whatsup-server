const { uploadAvatar } = require("../../../cloudinary");
const User = require("../../../model/user");
const AppError = require("../../../utils/appError");

const createProfile = async (req, res, next) => {
    const { id, name, about } = req.body;
    const { path } = req.file;

    try {
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
            { new: true, runValidators: true },
        );

        if (!user) {
            return next(
                new AppError(
                    "Something went wrong while creating proile. Please try again !",
                ),
            );
        }

        return res.status(200).json({
            status: "success",
            message: "Profile created successfully ...",
            user,
        });
    } catch (error) {
        return next(new AppError("Unexpected server error !", 500));
    }
};

module.exports = createProfile;
