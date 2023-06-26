const express = require('express');
const messageController = require('../controller/messageController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, messageController.sendMessage);
router.route('/:chatId').get(protect, messageController.getAllMessage);
// router.route('/:chatId').get(protect, messageController.getAllMessage)

module.exports = router;
