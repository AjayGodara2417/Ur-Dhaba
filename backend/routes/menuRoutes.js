const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getRestaurantMenu,
    toggleItemAvailability
} = require('../controllers/menuController');

// Get restaurant menu
router.get('/:restaurantId', getRestaurantMenu);

// Menu item operations
router.post('/:restaurantId', protect, addMenuItem);

router.route('/:restaurantId/item/:itemId')
    .put(protect, updateMenuItem)
    .delete(protect, deleteMenuItem);

// Toggle item availability
router.patch('/:restaurantId/item/:itemId/toggle-availability', protect, toggleItemAvailability);

module.exports = router;
