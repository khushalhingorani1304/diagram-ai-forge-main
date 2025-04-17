const express = require('express');
const { register, login, updateProfile, logout } = require('../controllers/userController');
const isAuthenticated = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/profile/update', isAuthenticated, updateProfile);

module.exports = router;
