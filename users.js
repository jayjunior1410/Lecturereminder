const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

// Admin can list users
router.get('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find({}, 'name email role createdAt');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;