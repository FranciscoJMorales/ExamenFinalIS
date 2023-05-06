var express = require("express");
var router = express.Router();
var adminController = require("../controllers/admin.controller");
const authService = require("../services/auth.service");

router.post('/candidates/create', authService.passport.authenticate(authService.passportConfig.strategiesNames.check, {session : false}), adminController.createCandidate);
router.post('/candidates/open', authService.passport.authenticate(authService.passportConfig.strategiesNames.check, {session : false}), adminController.openCandidateRegister);
router.post('/candidates/close', authService.passport.authenticate(authService.passportConfig.strategiesNames.check, {session : false}), adminController.closeCandidateRegister);
router.post('/voting/open', authService.passport.authenticate(authService.passportConfig.strategiesNames.check, {session : false}), adminController.openVoting);
router.post('/voting/close', authService.passport.authenticate(authService.passportConfig.strategiesNames.check, {session : false}), adminController.closeVoting);

module.exports = router;
