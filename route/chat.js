const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const sendMessage = require("../controller/chat/sendMessage");

router.post("/send-message", catchAsync(sendMessage));

module.exports = router;
