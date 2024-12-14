const cloudinary = require("cloudinary").v2;

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadAvatar = async (filePath) => {
  try {
    return await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
      folder: "whatsup-avatar",
    });
  } catch (error) {
    throw new Error("Error while uploading avatar to cloudinary");
  }
};

const uploadImageMessage = async (filePath) => {
  try {
    return await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
      folder: "image-message",
    });
  } catch (error) {
    throw new Error("Error while uploading image-message to cloudinary");
  }
};

const uploadVideoMessage = async (filePath) => {
  try {
    return await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      folder: "video-message",
    });
  } catch (error) {
    throw new Error("Error while uploading video-message to cloudinary");
  }
};

const uploadAudioMessage = async (filePath) => {
  try {
    return await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      folder: "audio-message",
    });
  } catch (error) {
    throw new Error("Error while uploading audio-message to cloudinary");
  }
};

const uploadApplicationMessage = async (filePath) => {
  try {
    return await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      folder: "application-message",
    });
  } catch (error) {
    throw new Error("Error while uploading application-message to cloudinary");
  }
};

const deleteImage = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  } catch (error) {
    throw new Error("Error while deleting the image from cloudinary");
  }
};
const deleteVideoAudio = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
  } catch (error) {
    throw new Error("Error while deleting the video/audio from cloudinary");
  }
};
const deleteApplication = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });
  } catch (error) {
    throw new Error("Error while deleting the document from cloudinary");
  }
};

module.exports = {
  uploadAvatar,
  uploadImageMessage,
  uploadVideoMessage,
  uploadAudioMessage,
  uploadApplicationMessage,
  deleteImage,
  deleteVideoAudio,
  deleteApplication,
};
