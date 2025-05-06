const express = require("express");
const { ping } = require("../controller/ping");
const router = express.Router();

router.get("/", ping);

module.exports = router;
