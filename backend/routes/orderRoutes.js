const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createOrder,
    getOrder,
    myOrders,
    getRestaurantOrders,
    updateOrder,
    assignDeliveryPartner,
    getDeliveryPartnerOrders
} = require('../controllers/orderController');

router.route('/')
    .post(protect, createOrder);

router.get('/me', protect, myOrders);
router.get('/restaurant', protect, getRestaurantOrders);
router.get('/delivery', protect, getDeliveryPartnerOrders);

router.route('/:id')
    .get(protect, getOrder)
    .put(protect, updateOrder);

router.put('/:id/assign-delivery', protect, assignDeliveryPartner);

module.exports = router;
