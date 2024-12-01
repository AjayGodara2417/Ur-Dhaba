const express = require('express');
const {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    addOrderRating,
    assignDeliveryPartner
} = require('../controllers/orderController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Public routes (for authenticated users)
router.route('/')
    .get(getOrders)
    .post(authorize('user'), createOrder);

router.route('/:id')
    .get(getOrder);

// Order status updates
router.route('/:id/status')
    .patch(authorize('admin', 'restaurant', 'delivery', 'user'), updateOrderStatus);

// Order rating
router.route('/:id/rating')
    .post(authorize('user'), addOrderRating);

// Admin only routes
router.route('/:id/assign')
    .patch(authorize('admin'), assignDeliveryPartner);

module.exports = router;
