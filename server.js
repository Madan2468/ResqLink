const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());

// Attach Socket.IO instance to app for global access
app.set('io', io);

// Basic Test Route
app.get('/', (req, res) => {
  res.send('🐾 Animal Rescue API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/test-cloudinary', require('./routes/testCloudinary'));


// Real-time Socket.IO connection
io.on('connection', socket => {
  console.log('🟢 New client connected');
  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});