const express = require('express');
const {
  registerUser,
  authUser,
  getAllUsers,
  getOneUser,
} = require('../controller/userController');
const uploadImageToCloudinary = require('../config/cloudinaryConfig');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const multer = require('multer');
// Cấu hình multer để xử lý dữ liệu đính kèm
const upload = multer({ dest: 'uploads/' });

router.route('/').post(registerUser).get(protect, getAllUsers);
router.post('/uploadAvatar', upload.single('image'), uploadImageToCloudinary);
router.post('/login', authUser);
router.get('/:id', getOneUser);
// router.get('/:slug', getOneUserSlug);
module.exports = router;
