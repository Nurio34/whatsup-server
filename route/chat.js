const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const sendMessage = require("../controller/chat/sendMessage");
const getChat = require("../controller/chat/getChat");
const messagesSeen = require("../controller/chat/messagesSeen");
const messagesDelivered = require("../controller/chat/messagesDelivered");

router.post("/send-message", catchAsync(sendMessage));
router.get("/get-chat/:userId/:connectionId", catchAsync(getChat));
router.get("/messages-seen/:userId/:connectionId", catchAsync(messagesSeen));
router.get(
  "/messages-delivered/:userId/:connectionId",
  catchAsync(messagesDelivered)
);

module.exports = router;
