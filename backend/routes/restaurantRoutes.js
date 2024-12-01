const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    createRestaurant,
    getAllRestaurants,
    getRestaurant,
    updateRestaurant,
    deleteRestaurant,
    searchRestaurants,
    getOwnerRestaurants,
    toggleRestaurantStatus,
    updateBankDetails,
    updateRestaurantHours,
    updateDocuments,
    getNearbyRestaurants,
    getRestaurantStats
} = require('../controllers/restaurantController');

// Public routes
router.get('/', getAllRestaurants);
router.get('/search', searchRestaurants);
router.get('/nearby', getNearbyRestaurants);
router.get('/:id', getRestaurant);

// Protected routes (require authentication)
router.use(protect);

// Restaurant owner routes
router.get('/owner/me', getOwnerRestaurants);
router.post('/', authorize('owner'), createRestaurant);
router.put('/:id', authorize('owner'), updateRestaurant);
router.delete('/:id', authorize('owner'), deleteRestaurant);
router.put('/:id/status', authorize('owner'), toggleRestaurantStatus);
router.put('/:id/hours', authorize('owner'), updateRestaurantHours);
router.put('/:id/bank-details', authorize('owner'), updateBankDetails);
router.put('/:id/documents', authorize('owner'), updateDocuments);
router.get('/:id/stats', authorize('owner'), getRestaurantStats);

module.exports = router;
