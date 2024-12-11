const {
  uploadImageMessage,
  uploadVideoMessage,
  uploadAudioMessage,
  uploadApplicationMessage,
} = require("../../cloudinary");
const Message = require("../../model/chat");
const AppError = require("../../utils/appError");

const sendMediaMessage = async (req, res, next) => {
  const { userId, reciverId, message } = req.body;
  const files = req.files;

  const typeOfMedia = (file) => file.mimetype.split("/")[0];

  const imageFiles = files.filter((file) => typeOfMedia(file) === "image");
  const videoFiles = files.filter((file) => typeOfMedia(file) === "video");
  const audioFiles = files.filter((file) => typeOfMedia(file) === "audio");
  const applicationFiles = files.filter(
    (file) => typeOfMedia(file) === "application"
  );

  const uploadImagesPromises = imageFiles.map((file) => {
    return uploadImageMessage(file.path);
  });
  const uploadVideosPromises = videoFiles.map((file) => {
    return uploadVideoMessage(file.path);
  });
  const uploadAudiosPromises = audioFiles.map((file) => {
    return uploadAudioMessage(file.path);
  });
  const uploadApplicationsPromises = applicationFiles.map((file) => {
    return uploadApplicationMessage(file.path);
  });

  const uploadImagesResponse = await Promise.all(uploadImagesPromises);
  const uploadVideosResponse = await Promise.all(uploadVideosPromises);
  const uploadAudiosResponse = await Promise.all(uploadAudiosPromises);
  const uploadApplicationsResponse = await Promise.all(
    uploadApplicationsPromises
  );

  const responses = uploadImagesResponse
    .concat(
      uploadVideosResponse,
      uploadAudiosResponse,
      uploadApplicationsResponse
    )
    .map((response) => {
      const {
        asset_id,
        public_id,
        width,
        height,
        resource_type,
        url,
        secure_url,
        format,
      } = response;

      return {
        asset_id,
        public_id,
        width,
        height,
        resource_type,
        url,
        secure_url,
        format,
      };
    });

  const isReciverOnline = onlineUsers.get(reciverId);

  const newMessage = await Message.create({
    senderId: userId,
    reciverId,
    type: "media",
    message,
    status: isReciverOnline ? "delivered" : "sent",
    medias: responses,
  });

  if (!newMessage)
    return next(new AppError("Error while sending message !"), 500);

  return res.status(201).json({
    status: "success",
  });
};

module.exports = sendMediaMessage;
