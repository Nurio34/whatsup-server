const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const sendMessage = require("../controller/chat/sendMessage");
const getChat = require("../controller/chat/getChat");
const messagesSeen = require("../controller/chat/messagesSeen");
const messagesDelivered = require("../controller/chat/messagesDelivered");
const fetchLostMessages = require("../controller/chat/fetchLostMessages");
const upload = require("../cloudinary/multer");
const sendMediaMessage = require("../controller/chat/sendMediaMessage");
const deleteMessage = require("../controller/chat/deleteMessage");
const deleteMessages = require("../controller/chat/deleteMessages");

router.post("/send-message", catchAsync(sendMessage));
router.get("/get-chat/:userId/:connectionId", catchAsync(getChat));
router.get("/messages-seen/:userId/:connectionId", catchAsync(messagesSeen));
router.get(
  "/messages-delivered/:userId/:connectionId",
  catchAsync(messagesDelivered)
);
router.post(
  "/fetch-lost-messages/:userId/:connectionId",
  catchAsync(fetchLostMessages)
);
router.post(
  "/send-media-message",
  upload.array("files"),
  catchAsync(sendMediaMessage)
);
router.delete("/delete-message", catchAsync(deleteMessage));
router.delete("/delete-messages", catchAsync(deleteMessages));

module.exports = router;
