const asyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken');
const User = require('../models/userModel');

const registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please enter all the fields');
  }

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    throw new Error('User already exists');
  }

  const user = await User.create({
    name: name,
    email: email,
    password: password,
    pic: pic,
  });

  if (user) {
    console.log('Json userController - registerUser');
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Failed to Create the User');
  }
};

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (user && (await User.matchPassword(password))) {
    console.log('Json userController - authUser');
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  }
});

module.exports = { registerUser, authUser };
