const Message = require("../../model/chat");
const AppError = require("../../utils/appError");

const sendMessage = async (req, res, next) => {
  console.log("sendMessage function");

  const { senderId, reciverId, message, type } = req.body;

  if (
    !Boolean(senderId) ||
    !Boolean(reciverId) ||
    !Boolean(message) ||
    !Boolean(type)
  )
    return next(new AppError("Error while sending message"), 500);

  const newMessage = await Message.create({
    message,
    senderId,
    reciverId,
    type,
    status: "sent",
  });

  if (!newMessage)
    return next(new AppError("Error while sending message !"), 500);

  return res.status(201).json({
    status: "success",
  });
};

module.exports = sendMessage;
