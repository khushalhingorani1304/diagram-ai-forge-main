require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // ✅ import cookie-parser
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true // ✅ Allow cookies in cross-origin requests
}));

app.use(express.json());
app.use(cookieParser()); // ✅ enable reading cookies

connectDB();

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
