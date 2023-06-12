const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const chatController = require('../controller/chatController');

const router = express.Router();

//Get all the current user's chats
router.get('/', protect, chatController.getAllChatCurrentUser);
router.post('/', protect, chatController.chatToOneUser);
router.post('/group', protect, chatController.createGroupChat);
router.route('/rename').put(protect, chatController.renameGroup);
router.route('/groupremove').put(protect, chatController.removeFromGroup);
router.route('/groupadd').put(protect, chatController.addToGroup);

// router.route('/').post(protect, accessChat);
// router.route('/').get(protect, fetchChats);

module.exports = router;
