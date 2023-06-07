const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config({ path: 'config.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//upload image to cloudinary server
const uploadImageToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file);
    console.log(result);
    // Do something with the uploaded image data
    //TODO:  return anything
  } catch (error) {
    console.error(error);
  }
};
//   uploadImageToCloudinary('/path/to/your/image.jpg');

module.exports = uploadImageToCloudinary;
