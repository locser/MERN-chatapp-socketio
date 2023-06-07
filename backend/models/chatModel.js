const mongose = require('mongoose');

const chatSchema = mongose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: mongose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    lastestMessage: {
      type: mongose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: mongose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('chat', chatSchema);
module.exports = Chat;

// chatName
// isGroupChat
// users
// lastestMessage
//GroupAdmin
