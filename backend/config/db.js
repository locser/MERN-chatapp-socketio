const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

dotenv.config({ path: 'config.env' });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useFindAndModify: true,
    });
    console.log(`MongoDB connected : ${conn.connection.host}`.cyan.underline);
  } catch (err) {
    console.error(err.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
