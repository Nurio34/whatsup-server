const Message = require("../../model/chat");
const AppError = require("../../utils/appError");

const getChat = async (req, res, next) => {
  console.log("getChat function");

  const { userId, connectionId } = req.params;

  if (!Boolean(userId) || !Boolean(connectionId))
    return next(new AppError("Error while getting chat", 500));

  const messages = await Message.find({
    $or: [
      { senderId: userId, reciverId: connectionId },
      { senderId: connectionId, reciverId: userId },
    ],
  })
    .sort({ createdAt: 1 })
    .select("type message status senderId createdAt _id medias");

  if (!Boolean(messages))
    return next(new AppError("There is not a chat between users !"), 404);

  return res.status(200).json({
    status: "success",
    message: "Here is chat",
    chat: {
      connectionId,
      messages,
    },
  });
};

module.exports = getChat;
