const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const getAllChatCurrentUser = asyncHandler(async (req, res) => {
  // Lấy thông tin người dùng từ req.user, protect sẽ xác định currentUser
  const userId = req.user._id;

  // userId null
  if (!userId) {
    return res.status(400).json({
      status: 'error',
      data: 'Invalid user ID',
    });
  }

  try {
    // Tìm tất cả các nhóm chat có người dùng đó hoặc người dùng tham gia
    const chats = await Chat.find({
      users: userId,
    })
      .populate('users', '-password')
      .populate('lastestMessage');
    res.status(200).json({
      status: 'success',
      data: chats,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      length: chats.length,
      data: 'Internal Server Error',
    });
  }
});

const chatToOneUser = asyncHandler(async (req, res) => {
  const userId = req.user._id; //current user
  const { otherUserId } = req.body; // lấy id người dùng muốn trò chuyện

  if (!otherUserId) {
    return res
      .status(400)
      .json({ status: 'error', data: 'otherUserId is required' });
  }

  // Kiểm tra xem otherUserId có tồn tại không
  const otherUser = await User.findById(otherUserId);

  if (!otherUser) {
    return res
      .status(400)
      .json({ status: 'error', data: 'Not found user with ID' });
  }

  // Kiểm tra xem người dùng cần trò chuyện có tồn tại hay không
  const existingChat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [currentUser._id, otherUser._id] },
  })
    // .populate('users', '-pasword')
    // .populate('groupAdmin', '-pasword')
    .populate('latestMessage')
    .sort({ updatedAt: -1 });

  if (existingChat) {
    // Nếu đã có cuộc trò chuyện, trả về thông tin cuộc trò chuyện
    return res.status(200).json({
      status: 'success',
      data: existingChat,
    });
  } else {
    // Tạo chat mới giữa người dùng hiện tại và người dùng khác
    const chatData = {
      chatName: 'Private Message',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      res.status(201).json({ status: 'error', data: createdChat });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 'error', data: 'Failed to create chat' });
    }
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  //check data before creating
  if (!req.body.users || !req.body.name) {
    return res
      .status(404)
      .json({ status: 'error', data: 'Please add a user to group!' });
  }
  // get user in group chat
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(404)
      .json({ status: 'error', data: 'Group chat need more than 2 users!' });
  }

  //add current user to group chat
  users.push(req.user);

  try {
    // create group chat
    const groupChat = await Chat.create({
      chatName: req.body.name, //get from client
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat.id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json({ status: 'success', data: fullGroupChat });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ status: 'error', data: 'Fail to create group chat!' });
  }
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedChat) {
    return res
      .status(404)
      .json({ status: 'error', data: 'Fail to rename group chat!' });
    throw new Error('Chat Not Found');
  } else {
    return res.status(200).json({ status: 'success', data: updatedChat });
  }
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!removed) {
    return res
      .status(404)
      .json({ status: 'error', data: 'Fail to remove group chat!' });
    throw new Error('Chat Not Found');
  } else {
    return res.status(200).json({ status: 'success', data: removed });
  }
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!added) {
    return res
      .status(404)
      .json({ status: 'error', data: 'Fail to add user to group chat!' });
    throw new Error('Chat Not Found');
  } else {
    return res.status(200).json({ status: 'success', data: added });
  }
});

module.exports = {
  getAllChatCurrentUser,
  chatToOneUser,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
