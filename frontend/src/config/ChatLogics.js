//kiểm tra xem người gửi của tin nhắn hiện tại có khác với userId (id của người dùng đã đăng nhập) hay không
export const isSameSender = (messages, mess, index, userId) => {
  return (
    index < messages.length - 1 &&
    (messages[index + 1].sender._id !== mess.sender._id ||
      messages[index + 1].sender._id !== undefined) &&
    messages[index].sender._id !== userId
  );
};

//kiểm tra xem tin nhắn hiện tại (mess) có phải là tin nhắn cuối cùng trong mảng messages hay không
export const isLastMessage = (messages, index, userId) => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

//Hàm này kiểm tra xem tin nhắn hiện tại (mess) có cùng người gửi với tin nhắn trước đó trong mảng messages
export const isSameUser = (messages, mess, index) => {
  return index > 0 && messages[index - 1].sender._id === mess.sender._id;
};

export const isSameSenderMargin = (messages, mess, index, userId) => {
  if (
    index < messages.length - 1 &&
    messages[index + 1].sender._id === mess.sender._id &&
    messages[index].sender._id !== userId
  ) {
    return 5;
    // return 33; ?
  } else if (
    (index < messages.length - 1 &&
      messages[index + 1].sender._id !== mess.sender._id &&
      messages[index].sender._id !== userId) ||
    (index === messages.length - 1 && messages[index].sender._id !== userId)
  ) {
    return 5;
    // return 0;
  } else return 'auto';
};

export const getSender = (loggedUser, users) => {
  // TODO: fix this login
  // console.log(
  //   'getSender: ' + JSON.stringify(loggedUser) + ' ' + JSON.stringify(users)
  // );
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  // TODO: fix this login

  // console.log(
  //   'getSenderFull : ' +
  //     JSON.stringify(loggedUser) +
  //     ' ' +
  //     JSON.stringify(users)
  // );
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
