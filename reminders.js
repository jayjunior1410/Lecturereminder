const express = require('express');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

module.exports = function(io) {
  const router = express.Router();

  // List reminders relevant to the authenticated user (sent or received)
  router.get('/', auth, async (req, res) => {
    try {
      const userId = req.user.id;
      const reminders = await Reminder.find({
        $or: [{ senderId: userId }, { recipientId: userId }]
      }).populate('senderId', 'name email role').populate('recipientId', 'name email role').sort({ createdAt: -1 });
      res.json(reminders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  });

  // Create a reminder
  router.post('/', auth, async (req, res) => {
    try {
      const { recipientId, title, message, lectureTime } = req.body;
      const senderId = req.user.id;

      const recipient = await User.findById(recipientId);
      if (!recipient) return res.status(400).json({ msg: 'Recipient not found' });

      // Business rules: students can remind lecturers and lecturers can remind students
      const sender = await User.findById(senderId);
      if (sender.role === 'student' && recipient.role !== 'lecturer') {
        return res.status(403).json({ msg: 'Students can only remind lecturers' });
      }
      if (sender.role === 'lecturer' && recipient.role !== 'student') {
        return res.status(403).json({ msg: 'Lecturers can only remind students' });
      }

      const reminder = await Reminder.create({ senderId, recipientId, title, message, lectureTime });
      // Emit real-time event using server's emitReminder (server app set)
      req.app.get('emitReminder')(reminder);
      res.json(reminder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  });

  // Mark as read
  router.put('/:id/read', auth, async (req, res) => {
    try {
      const { id } = req.params;
      const reminder = await Reminder.findByIdAndUpdate(id, { read: true }, { new: true });
      if (!reminder) return res.status(404).json({ msg: 'Not found' });
      res.json(reminder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
  });

  return router;
};