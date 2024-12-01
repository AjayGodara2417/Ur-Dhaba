const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    registerUser,
    loginUser,
    logout,
    getUserProfile,
    updateProfile,
    updatePassword
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateProfile);

router.put('/password/update', protect, updatePassword);

module.exports = router;
