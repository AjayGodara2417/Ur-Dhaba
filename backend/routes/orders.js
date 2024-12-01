const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    getRestaurantOrders,
    getUserOrders,
    cancelOrder
} = require('../controllers/orderController');

router.route('/')
    .post(protect, createOrder)
    .get(protect, authorize('admin'), getOrders);

router.get('/user', protect, getUserOrders);
router.get('/restaurant/:restaurantId', protect, authorize('owner', 'admin'), getRestaurantOrders);

router.route('/:id')
    .get(protect, getOrder)
    .patch(protect, authorize('owner', 'admin'), updateOrderStatus);

router.patch('/:id/cancel', protect, cancelOrder);

module.exports = router;
