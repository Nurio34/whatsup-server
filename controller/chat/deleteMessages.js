const Message = require("../../model/chat");
const AppError = require("../../utils/appError");
const deleteMedias = require("./deleteMedias");

const deleteMessages = async (req, res, next) => {
  const messages = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return next(new AppError("No valid messages provided for deletion", 400));
  }

  const result = await Message.deleteMany({
    _id: { $in: messages },
  });

  if (!result.acknowledged)
    return next(
      new AppError("Deletion operation not acknowledged by the database", 500)
    );

  if (result.deletedCount === 0)
    return next(new AppError("No messages found to delete.", 404));

  //! *** DELETE MEDIAS ***
  const medias = messages.map((message) => message.medias).flat();
  const deleteMediasResult = await deleteMedias(medias);
  //! *********************

  if (deleteMediasResult) {
    res.status(200).json({
      status: "success",
      message: `${result.deletedCount} messages deleted successfully.`,
    });
  }
};

module.exports = deleteMessages;
