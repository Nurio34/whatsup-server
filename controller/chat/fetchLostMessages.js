const Message = require("../../model/chat");
const AppError = require("../../utils/appError");

const fetchLostMessages = async (req, res, next) => {
  const { userId, connectionId } = req.params;
  const { totalMessages } = req.body;

  if (!Boolean(userId) || !Boolean(connectionId))
    return next(new AppError("Error while fetchLostMessages", 500));

  if (totalMessages === 0) {
    return res.status(200).json({
      status: "success",
      messages: [],
    });
  }

  const totalCount = await Message.countDocuments({
    senderId: connectionId,
    reciverId: userId,
  });

  const lostMessagesCount = totalCount - totalMessages;
  if (lostMessagesCount <= 0) {
    return res.status(200).json({
      status: "success",
      messages: [],
    });
  }

  const messages = await Message.find({
    senderId: connectionId,
    reciverId: userId,
  })
    .sort({ createdAt: 1 })
    .skip(totalMessages)
    .limit(lostMessagesCount)
    .select("type message status senderId createdAt _id");

  res.status(200).json({
    status: "success",
    messages,
  });
};

module.exports = fetchLostMessages;
