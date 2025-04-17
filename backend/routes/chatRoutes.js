// const express = require('express');
// const { sendMessage, getHistory, clearHistory } = require('../controllers/chatController.js');
// const isAuthenticated = require('../middleware/authMiddleware');

// const router = express.Router();

// router.post('/', sendMessage);
// router.get('/', getHistory);
// router.delete('/',  clearHistory);

// module.exports = router;


const express = require('express');
const {
  sendMessage,
  getHistory,
  clearHistory,
} = require('../controllers/chatController.js');

const router = express.Router();

// Public routes - no auth middleware
router.post('/', sendMessage);
router.get('/', getHistory);
router.delete('/', clearHistory);

module.exports = router;
