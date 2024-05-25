const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/property", require("./seller"));

module.exports = router;
