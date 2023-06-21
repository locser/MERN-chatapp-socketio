export const getSender = (loggedUser, users) => {
  console.log(
    'getSender: ' + JSON.stringify(loggedUser) + ' ' + JSON.stringify(users)
  );
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  console.log(
    'getSenderFull : ' +
      JSON.stringify(loggedUser) +
      ' ' +
      JSON.stringify(users)
  );
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
