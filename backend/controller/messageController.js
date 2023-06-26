const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  //get content and chat id
  const { content, chatId } = req.body;

  // check if content or chatId
  if (!content || !chatId) {
    console.log('Invalid content or chatId into request ');
    return res.status(400).json({
      status: 'error',
      data: 'Invalid content or chatId into request!',
    });
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    //save new message into mongodb
    var message = await Message.create(newMessage);

    // nạp thông tin người gửi
    // message = await Message.populate('sender', 'name picture');
    //nạp thông tin đoạn hội thoại
    // message = await Message.populate('chat');
    // message = await Message.populate(message, {
    //   path: 'chat.users',
    //   select: 'name picture email',
    // });
    message = await Message.populate(message, [
      { path: 'sender', select: 'name picture email' },
      {
        path: 'chat',
        populate: { path: 'users', select: 'name picture email' },
      },
    ]);

    // console.log(message);

    await Chat.findByIdAndUpdate(req.body.chatId, {
      lastestMessage: message._id,
    });
    res.status(200).json({
      data: message,
    });
  } catch (error) {
    console.log('Error creating message: ' + error.message);
    return res.status(400).json({
      status: 'error',
      data: 'Error creating message: ' + error.message,
    });
  }
});

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const getAllMessage = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId; //because /:chatId, it is parameter

  try {
    message = await Message.find({ chat: chatId })
      .populate({ path: 'sender', select: 'name picture email' })
      .populate({ path: 'chat' });

    res.status(200).json({ data: message });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      data: 'Error creating message: ' + err,
    });
  }
});
module.exports = { sendMessage, getAllMessage };
