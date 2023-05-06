var express = require("express");
var router = express.Router();
var voteController = require("../controllers/vote.controller");

router.post('/', voteController.vote);

module.exports = router;
