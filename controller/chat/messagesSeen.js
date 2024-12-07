const Message = require("../../model/chat");
const AppError = require("../../utils/appError");

const messagesSeen = async (req, res, next) => {
  const { userId, connectionId } = req.params;
  console.log({ userId, connectionId });

  if (!Boolean(userId) || !Boolean(connectionId))
    return next(new AppError("Error while getting chat", 500));

  await Message.updateMany(
    {
      reciverId: userId,
      senderId: connectionId,
      status: { $ne: "seen" },
    },
    { $set: { status: "seen" } }
  );

  res.status(200).json({
    status: "success",
  });
};

module.exports = messagesSeen;
