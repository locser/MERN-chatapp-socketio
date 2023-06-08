const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: 'config.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (req, res) => {
  try {
    //TODO: name folder
    const imageFilePath = req.file.path; // Lấy đường dẫn tạm thời của ảnh từ req.file.path

    const result = await cloudinary.uploader.upload(imageFilePath); // Tải ảnh lên Cloudinary

    fs.unlinkSync(imageFilePath); // Xóa tệp tạm thời đã tải lên

    console.log(result); // Kết quả từ Cloudinary

    res.status(200).json({ status: 'success', data: result.url }); // Gửi kết quả về cho client
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', data: error });
  }
};

// //upload image to cloudinary server
// const uploadImageToCloudinary = async (req, res) => {
//   try {
//     // const image = formData.get('image');
//     const image = req.files.image;
//     console.log(image);
//     const result = await cloudinary.uploader.upload(image);
//     console.log(result);
//     // Do something with the uploaded image data
//     //TODO:  return anything
//     // return result;
//   } catch (error) {
//     console.error(error);
//   }
// };

// //upload image to cloudinary server
// const uploadImageToCloudinary = async (formData) => {
//   try {
//     const imgBlob = formData.get('image'); //lấy giá trị của trường image trong formData
//     console.log('imgBlob', imgBlob);
//     const result = await cloudinary.uploader.upload(imgBlob);
//     console.log(result);
//     // Do something with the uploaded image data
//     //TODO:  return anything
//     // return result;
//   } catch (error) {
//     console.error(error);
//   }
// };

//   uploadImageToCloudinary('/path/to/your/image.jpg');

module.exports = uploadImageToCloudinary;
