const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const sendMessage = require("../controller/chat/sendMessage");
const getChat = require("../controller/chat/getChat");

router.post("/send-message", catchAsync(sendMessage));
router.get("/get-chat/:userId/:connectionId", catchAsync(getChat));

module.exports = router;
