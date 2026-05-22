const express = require('express');
const router = express.Router();
const speakerController = require('../controllers/speakerController');

router.get('/', speakerController.getAll);
router.get('/:id', speakerController.getById);
router.post('/', speakerController.create);
router.put('/:id', speakerController.update);
router.delete('/:id', speakerController.delete);

module.exports = router;