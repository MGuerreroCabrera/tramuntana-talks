const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/talks', publicController.getTalks);
router.get('/talks/:id', publicController.getTalkById);
router.post('/talks/:talkId/register', publicController.registerToTalk);

module.exports = router;
