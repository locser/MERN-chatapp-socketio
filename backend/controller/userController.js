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

  const user = await User.findOne({ email: email }).select('+password');
  console.log(user);

  if (user && (await user.matchPassword(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  }
});

// api/user
const getAllUsers = asyncHandler(async (req, res) => {
  const allUser = await User.find();

  res.status(200).json({
    status: 'success',
    length: allUser.length,
    data: allUser,
  });
});

// /api/user/:id
const getOneUser = asyncHandler(async (req, res) => {
  let query = User.findById(req.params.id);
  const user = await query;
  if (!user) {
    return res
      .status(404)
      .json({ status: '404 Not Found', error: '404 Not Found' });
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

const getOneUserSlug = asyncHandler(async (req, res) => {
  const user = await User.findOne({ slug: req.params.slug });

  if (!user) {
    return res
      .status(404)
      .json({ status: '404 Not Found', error: '404 Not Found' });
  }
  res.status(200).json({
    status: 'success',
    data: user,
  });
});

module.exports = {
  registerUser,
  authUser,
  getAllUsers,
  getOneUser,
  getOneUserSlug,
};
