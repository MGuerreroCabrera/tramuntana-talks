const express = require('express');
const router = express.Router();
const attendeeController = require('../controllers/attendeeController');

router.get('/', attendeeController.getAll);
router.get('/:id', attendeeController.getById);
router.post('/', attendeeController.create);
router.put('/:id', attendeeController.update);
router.delete('/:id', attendeeController.delete);
router.post('/:id/talks/:talkId', attendeeController.registerToTalk);
router.delete('/:id/talks/:talkId', attendeeController.unregisterFromTalk);

module.exports = router;