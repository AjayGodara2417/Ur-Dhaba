const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
    createRestaurant,
    getAllRestaurants,
    getRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getOwnerRestaurants,
    toggleRestaurantStatus,
    updateRestaurantHours,
    updateBankDetails,
    searchRestaurants,
    getNearbyRestaurants,
    getRestaurantStats
} = require('../controllers/restaurantController');

router.route('/')
    .get(getAllRestaurants)
    .post(protect, authorize('owner', 'admin'), createRestaurant);

router.get('/owner', protect, authorize('owner', 'admin'), getOwnerRestaurants);
router.get('/search', searchRestaurants);
router.get('/nearby', getNearbyRestaurants);

router.route('/:id')
    .get(getRestaurant)
    .put(protect, authorize('owner', 'admin'), updateRestaurant)
    .delete(protect, authorize('owner', 'admin'), deleteRestaurant);

router.patch('/:id/toggle-status', protect, authorize('owner', 'admin'), toggleRestaurantStatus);
router.patch('/:id/hours', protect, authorize('owner', 'admin'), updateRestaurantHours);
router.patch('/:id/bank-details', protect, authorize('owner', 'admin'), updateBankDetails);
router.get('/:id/stats', protect, authorize('owner', 'admin'), getRestaurantStats);

module.exports = router;
