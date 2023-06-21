const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const colors = require('colors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config({ path: 'config.env' });

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

connectDB();

app.get('/', (req, res) => {
  res.send('API is running successfully');
});

app.use(express.json()); // to accept JSON data

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, console.log(`server listening on PORT: ${PORT}`.yellow.bold));
