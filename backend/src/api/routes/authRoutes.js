const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.get('/me', userController.getMe);

module.exports = router;
