var express = require("express");
var router = express.Router();
var voteController = require("../controllers/vote.controller");

router.post('/', voteController.vote);
router.get('/candidates', voteController.viewCandidates);
router.get('/report', voteController.getVoteReport);

module.exports = router;
