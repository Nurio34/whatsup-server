const {
  deleteImage,
  deleteVideoAudio,
  deleteApplication,
} = require("../../cloudinary");

const deleteMedias = async (medias) => {
  const images = medias.filter((media) => media.resource_type === "image");
  const videos_audios = medias.filter(
    (media) => media.resource_type === "video"
  );
  const applications = medias.filter((media) => media.resource_type === "raw");

  const imageDeletePromises = images.map((image) =>
    deleteImage(image.public_id)
  );
  const videosAudioDeletePromises = videos_audios.map((video_audio) =>
    deleteVideoAudio(video_audio.public_id)
  );
  const appliationDeletePromises = applications.map((application) =>
    deleteApplication(application.public_id)
  );

  const imagesDeleteResponse = await Promise.all(imageDeletePromises);
  const videosAudiosDeleteResponse = await Promise.all(
    videosAudioDeletePromises
  );
  const applicationsDeleteResponse = await Promise.all(
    appliationDeletePromises
  );

  const responses = imagesDeleteResponse.concat(
    videosAudiosDeleteResponse,
    applicationsDeleteResponse
  );

  const isAllResponsesOk = responses.every(
    (response) => response.result === "ok" || response.result === "not-found"
  );

  if (!isAllResponsesOk) return deleteMedias(medias);

  return true;
};

module.exports = deleteMedias;
