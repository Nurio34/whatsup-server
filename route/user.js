const express = require("express");
const catchAsync = require("../utils/catchAsync");
const getUser = require("../controller/user/getUser");
const checkAuthentication = require("../middleware/auth/checkAuthentication");
const updateStatusOnline = require("../controller/user/updateStatusOnline");
const updateStatusOffline = require("../controller/user/updateStatusOffline.");
const findUser = require("../controller/user/findUser");
const router = express.Router();

router.get("/get-user", catchAsync(checkAuthentication), catchAsync(getUser));
router.get("/find-user/:username", catchAsync(findUser));
router.patch("/update-status-online/:userId", catchAsync(updateStatusOnline));
router.patch("/update-status-offline/:userId", catchAsync(updateStatusOffline));

module.exports = router;
