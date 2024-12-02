const express = require('express');
const {
    getDeliveryPartners,
    getDeliveryPartner,
    createDeliveryPartner,
    updateDeliveryPartner,
    updateLocation,
    toggleAvailability,
    getStats
} = require('../controllers/deliveryPartnerController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes with different access levels
router
    .route('/')
    .get(authorize('admin'), getDeliveryPartners)
    .post(authorize('user'), createDeliveryPartner);

router
    .route('/:id')
    .get(authorize('admin', 'delivery'), getDeliveryPartner)
    .put(authorize('delivery', 'admin'), updateDeliveryPartner);

router
    .route('/:id/location')
    .patch(authorize('delivery'), updateLocation);

router
    .route('/:id/toggle-availability')
    .patch(authorize('delivery'), toggleAvailability);

router
    .route('/:id/stats')
    .get(authorize('delivery', 'admin'), getStats);

module.exports = router;
