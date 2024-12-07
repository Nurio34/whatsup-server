const Message = require("../../model/chat");
const AppError = require("../../utils/appError");

const messagesDelivered = async (req, res, next) => {
  const { userId, connectionId } = req.params;

  if (!Boolean(userId) || !Boolean(connectionId))
    return next(new AppError("Error while getting chat", 500));

  await Message.updateMany(
    {
      reciverId: userId,
      senderId: connectionId,
      status: { $ne: "delivered" },
    },
    { $set: { status: "delivered" } }
  );

  res.status(200).json({
    status: "success",
  });
};

module.exports = messagesDelivered;
