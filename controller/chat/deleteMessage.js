const Message = require("../../model/chat");
const AppError = require("../../utils/appError");
const deleteMedias = require("./deleteMedias");

const deleteMessage = async (req, res, next) => {
  const message = req.body;

  const result = await Message.deleteOne({ _id: message._id });

  if (result.deletedCount === 0)
    return next(new AppError("No message found", 404));

  //! *** DELETE MEDIAS ***
  const medias = message.medias;
  const deleteMediasResult = await deleteMedias(medias);
  //! *********************

  if (deleteMediasResult) {
    return res.status(200).json({
      status: "success",
      message: "Message deleted successfully.",
    });
  }
};

module.exports = deleteMessage;
