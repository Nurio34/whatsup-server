const express = require("express");
const router = express.Router();

const connect = require("../controller/contact/connect");
const catchAsync = require("../utils/catchAsync");
const getConnections = require("../controller/contact/getConnections");
const getConnection = require("../controller/contact/getConnection");

router.get("/connect/:userId/:foundUserId", catchAsync(connect));
router.get("/getConnections/:userId", catchAsync(getConnections));
router.get("/getConnection/:id", catchAsync(getConnection));

module.exports = router;
