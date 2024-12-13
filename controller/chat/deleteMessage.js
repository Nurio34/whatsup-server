const Message = require("../../model/chat");
const AppError = require("../../utils/appError");

const deleteMessage = async (req, res, next) => {
  const { messageId } = req.params;

  const result = await Message.deleteOne({ _id: messageId });

  if (result.deletedCount === 0)
    return next(new AppError("No message found", 404));

  return res.status(200).json({
    status: "success",
    message: "Message deleted successfully.",
  });
};

module.exports = deleteMessage;
