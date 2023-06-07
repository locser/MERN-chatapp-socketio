const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectID,
    },
    constent: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'Chat',
    },
  },
  {
    timestamp: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
