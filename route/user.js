const express = require("express");
const getUser = require("../controller/user/getUser");
const getAllUsers = require("../controller/user/getAllUsers");
const router = express.Router();

router.post("/get-user", getUser);
router.get("/get-all-users", getAllUsers);

module.exports = router;
