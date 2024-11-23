const express = require("express");
const catchAsync = require("../utils/catchAsync");
const getUser = require("../controller/user/getUser");
const getAllUsers = require("../controller/user/getAllUsers");
const checkAuthentication = require("../middleware/auth/checkAuthentication");
const router = express.Router();

router.get(
  "/get-user/:id",
  catchAsync(checkAuthentication),
  catchAsync(getUser)
);
router.get("/get-all-users", catchAsync(getAllUsers));

module.exports = router;
