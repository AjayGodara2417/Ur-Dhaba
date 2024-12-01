const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
    getMenu,
    updateMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability
} = require('../controllers/menuController');

router.route('/:restaurantId')
    .get(getMenu)
    .put(protect, authorize('owner', 'admin'), updateMenu);

router.route('/:restaurantId/items')
    .post(protect, authorize('owner', 'admin'), addMenuItem);

router.route('/:restaurantId/items/:itemId')
    .put(protect, authorize('owner', 'admin'), updateMenuItem)
    .delete(protect, authorize('owner', 'admin'), deleteMenuItem);

router.patch('/:restaurantId/items/:itemId/toggle',
    protect,
    authorize('owner', 'admin'),
    toggleItemAvailability
);

module.exports = router;
