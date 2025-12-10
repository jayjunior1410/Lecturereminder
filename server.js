const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { createServer } = require('http');

dotenv.config();
const app = express();
const server = createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// Models
const User = require('./models/User');
const Reminder = require('./models/Reminder');

// Routes
const authRoutes = require('./routes/auth');
const reminderRoutes = require('./routes/reminders');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/reminders', reminderRoutes(io)); // pass io to route factory
app.use('/api/users', userRoutes);

// Socket.IO simple auth mapping
const userSockets = new Map(); // userId -> socket.id(s)

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);

  socket.on('identify', (userId) => {
    if (!userId) return;
    const set = userSockets.get(userId) || new Set();
    set.add(socket.id);
    userSockets.set(userId, set);
    socket.data.userId = userId;
  });

  socket.on('disconnect', () => {
    const userId = socket.data.userId;
    if (userId) {
      const set = userSockets.get(userId);
      if (set) {
        set.delete(socket.id);
        if (set.size === 0) userSockets.delete(userId);
        else userSockets.set(userId, set);
      }
    }
    console.log('Socket disconnected', socket.id);
  });
});

// Helper used by routes to emit reminders to recipients
app.set('emitReminder', (reminder) => {
  // send to receiverId
  const { recipientId } = reminder;
  const set = userSockets.get(String(recipientId));
  if (set) {
    for (const sid of set) {
      io.to(sid).emit('reminder', reminder);
    }
  }
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    server.listen(PORT, () => console.log('Server listening on', PORT));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
start();