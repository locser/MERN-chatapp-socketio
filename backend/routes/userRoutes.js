const express = require('express');
const { registerUser, authUser } = require('../controller/userController');
const uploadImageToCloudinary = require('../config/cloudinaryConfig');

const router = express.Router();

const multer = require('multer');
// Cấu hình multer để xử lý dữ liệu đính kèm
const upload = multer({ dest: 'uploads/' });

router.route('/').post(registerUser);
router.post('/uploadAvatar', upload.single('image'), uploadImageToCloudinary);
router.post('/login', authUser);
module.exports = router;
