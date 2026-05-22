const express = require('express');
const router = express.Router();
const talkController = require('../controllers/talkController');

router.get('/', talkController.getAll);
router.get('/:id', talkController.getById);
router.post('/', talkController.create);
router.put('/:id', talkController.update);
router.delete('/:id', talkController.delete);

module.exports = router;