const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { promisify } = require('util');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      //decode token id
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'Please login to use!',
        });
      }

      next();
    } catch (err) {
      res.status(401).json({
        status: 'error',
        message: 'Not authorized, token failed',
      });
      console.error(err);
    }
  }

  if (!token) {
    res.status(401).json({
      status: 'error',
      message: 'Not authorized, token failed',
    });
  }
});

module.exports = { protect };
