const Contact = require("../../../model/contact");
const AppError = require("../../../utils/appError");

const connect = async (req, res, next) => {
  console.log("connect function");

  const { userId, foundUserId } = req.params;

  try {
    let userContacts = await Contact.findOne({ userId });

    if (!userContacts) {
      userContacts = await Contact.create({
        userId,
        connectWith: [foundUserId],
      });
    } else {
      userContacts = await Contact.findOneAndUpdate(
        { userId },
        { $addToSet: { connectWith: foundUserId } },
        { new: true, upsert: true }
      );
    }

    let foundUserContacts = await Contact.findOne({ userId: foundUserId });

    if (!foundUserContacts) {
      foundUserContacts = await Contact.create({
        userId: foundUserId,
        connectWith: [userId],
      });
    } else {
      foundUserContacts = await Contact.findOneAndUpdate(
        { userId: foundUserId },
        { $addToSet: { connectWith: userId } },
        { new: true, upsert: true }
      );
    }

    return res.status(200).json({
      status: "success",
      message: "Connection successful!",
      connectWith: userContacts.connectWith,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError("Server Error!", 500));
  }
};

module.exports = connect;
