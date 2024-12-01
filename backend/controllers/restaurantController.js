const Restaurant = require('../models/Restaurant');
const Menu = require('../models/menuModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create new restaurant
// @route   POST /api/restaurants
// @access  Private
exports.createRestaurant = asyncHandler(async (req, res, next) => {
    req.body.owner = req.user.id;

    const existingRestaurant = await Restaurant.findOne({ owner: req.user.id });

    if (existingRestaurant && req.user.role !== 'admin') {
        return next(new ErrorResponse('User already has a restaurant registered', 400));
    }

    const menu = await Menu.create({
        restaurant: null,
        items: []
    });

    const restaurantData = {
        ...req.body,
        menu: menu._id
    };

    const restaurant = await Restaurant.create(restaurantData);

    menu.restaurant = restaurant._id;
    await menu.save();

    res.status(201).json({
        success: true,
        data: restaurant
    });
});

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
exports.getAllRestaurants = asyncHandler(async (req, res, next) => {
    const {
        page = 1,
        limit = 10,
        sort = '-rating',
        cuisine,
        priceRange,
        isOpen,
        minRating,
        search,
        lat,
        lng,
        radius = 5000
    } = req.query;

    const query = {};

    // Add filters
    if (cuisine) {
        query.cuisine = cuisine;
    }

    if (priceRange) {
        query.priceRange = priceRange;
    }

    if (isOpen !== undefined) {
        query.isOpen = isOpen === 'true';
    }

    if (minRating) {
        query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { cuisine: { $regex: search, $options: 'i' } },
            { 'address.city': { $regex: search, $options: 'i' } }
        ];
    }

    // Add geospatial search if coordinates provided
    if (lat && lng) {
        query.location = {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                $maxDistance: parseInt(radius)
            }
        };
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        populate: {
            path: 'menu',
            select: 'items'
        }
    };

    const restaurants = await Restaurant.paginate(query, options);

    res.status(200).json({
        success: true,
        data: restaurants
    });
});

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
exports.getRestaurant = asyncHandler(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.id).populate('menu');

    if (!restaurant) {
        return next(new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: restaurant
    });
});

// @desc    Get owner restaurants
// @route   GET /api/restaurants/owner
// @access  Private
exports.getOwnerRestaurants = asyncHandler(async (req, res, next) => {
    const restaurants = await Restaurant.find({ owner: req.user.id })
        .populate('menu', 'items')
        .select('-bankDetails -documents');

    res.status(200).json({
        success: true,
        data: restaurants
    });
});

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private
exports.updateRestaurant = asyncHandler(async (req, res, next) => {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        return next(new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this restaurant`, 401));
    }

    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: restaurant
    });
});

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        return next(new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this restaurant`, 401));
    }

    await restaurant.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Toggle restaurant status
// @route   PATCH /api/restaurants/:id/toggle-status
// @access  Private
exports.toggleRestaurantStatus = asyncHandler(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        return next(new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this restaurant`, 401));
    }

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    res.status(200).json({
        success: true,
        data: restaurant
    });
});

// @desc    Update restaurant hours
// @route   PUT /api/restaurants/:id/hours
// @access  Private
exports.updateRestaurantHours = asyncHandler(async (req, res, next) => {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        return next(new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this restaurant`, 401));
    }

    restaurant.hours = req.body.hours;
    await restaurant.save();

    res.status(200).json({
        success: true,
        data: restaurant
    });
});

// @desc    Update restaurant bank details
// @route   PUT /api/restaurants/:id/bank-details
// @access  Private
exports.updateBankDetails = asyncHandler(async (req, res, next) => {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        return next(new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this restaurant`, 401));
    }

    restaurant.bankDetails = {
        ...restaurant.bankDetails,
        ...req.body.bankDetails
    };
    
    await restaurant.save();

    res.status(200).json({
        success: true,
        data: restaurant
    });
});

// @desc    Search restaurants
// @route   GET /api/restaurants/search
// @access  Public
exports.searchRestaurants = asyncHandler(async (req, res, next) => {
    const { q, lat, lng, radius = 5000 } = req.query;

    const query = {
        'status.isActive': true,
        $text: { $search: q }
    };

    if (lat && lng) {
        query['address.coordinates'] = {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                $maxDistance: parseInt(radius)
            }
        };
    }

    const restaurants = await Restaurant.find(query)
        .select('-bankDetails -documents')
        .sort({ score: { $meta: 'textScore' } });

    res.status(200).json({
        success: true,
        data: restaurants
    });
});

// @desc    Get nearby restaurants
// @route   GET /api/restaurants/nearby
// @access  Public
exports.getNearbyRestaurants = asyncHandler(async (req, res, next) => {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
        return next(new ErrorResponse('Location coordinates are required', 400));
    }

    const restaurants = await Restaurant.find({
        'status.isActive': true,
        'address.coordinates': {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                $maxDistance: parseInt(radius)
            }
        }
    }).select('-bankDetails -documents');

    res.status(200).json({
        success: true,
        data: restaurants
    });
});

// @desc    Get restaurant statistics
// @route   GET /api/restaurants/:id/stats
// @access  Private
exports.getRestaurantStats = asyncHandler(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        return next(new ErrorResponse('Restaurant not found', 404));
    }

    // Check ownership
    if (restaurant.owner.toString() !== req.user._id.toString()) {
        return next(new ErrorResponse('Not authorized to view statistics', 403));
    }

    // Here you can add more statistics calculations
    const stats = {
        rating: restaurant.rating,
        totalOrders: 0, // To be implemented with order model
        averageOrderValue: 0, // To be implemented with order model
        topItems: [], // To be implemented with order model,
    };

    res.status(200).json({
        success: true,
        data: stats
    });
});

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
exports.getAllRestaurants = asyncHandler(async (req, res, next) => {
    const restaurants = await Restaurant.find().populate('menu');
    
    res.status(200).json({
        success: true,
        count: restaurants.length,
        data: restaurants
    });
});

// @desc    Get owner's restaurants
// @route   GET /api/restaurants/owner/me
// @access  Private
exports.getOwnerRestaurants = asyncHandler(async (req, res, next) => {
    const restaurants = await Restaurant.find({ owner: req.user.id }).populate('menu');

    res.status(200).json({
        success: true,
        count: restaurants.length,
        data: restaurants
    });
});

// @desc    Toggle restaurant status
// @route   PUT /api/restaurants/:id/status
// @access  Private
exports.toggleRestaurantStatus = asyncHandler(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        return next(new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this restaurant`, 401));
    }

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    res.status(200).json({
        success: true,
        data: restaurant
    });
});

// @desc    Update restaurant bank details
// @route   PUT /api/restaurants/:id/bank-details
// @access  Private
exports.updateBankDetails = asyncHandler(async (req, res, next) => {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        return next(new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this restaurant`, 401));
    }

    restaurant.bankDetails = {
        ...restaurant.bankDetails,
        ...req.body
    };

    await restaurant.save();

    res.status(200).json({
        success: true,
        data: restaurant
    });
});

// @desc    Update restaurant hours
// @route   PUT /api/restaurants/:id/hours
// @access  Private
exports.updateRestaurantHours = asyncHandler(async (req, res, next) => {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        return next(new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this restaurant`, 401));
    }

    restaurant.businessHours = req.body;
    await restaurant.save();

    res.status(200).json({
        success: true,
        data: restaurant
    });
});

// @desc    Update restaurant documents
// @route   PUT /api/restaurants/:id/documents
// @access  Private
exports.updateDocuments = asyncHandler(async (req, res, next) => {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        return next(new ErrorResponse(`Restaurant not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this restaurant`, 401));
    }

    restaurant.documents = {
        ...restaurant.documents,
        ...req.body
    };

    await restaurant.save();

    res.status(200).json({
        success: true,
        data: restaurant
    });
});

// @desc    Search restaurants
// @route   GET /api/restaurants/search
// @access  Public
exports.searchRestaurants = asyncHandler(async (req, res, next) => {
    const { query = '', cuisine, priceRange } = req.query;

    const searchQuery = {
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ]
    };

    if (cuisine) {
        searchQuery.cuisine = cuisine;
    }

    if (priceRange) {
        searchQuery.priceRange = priceRange;
    }

    const restaurants = await Restaurant.find(searchQuery).populate('menu');

    res.status(200).json({
        success: true,
        count: restaurants.length,
        data: restaurants
    });
});

// @desc    Get nearby restaurants
// @route   GET /api/restaurants/nearby
// @access  Public
exports.getNearbyRestaurants = asyncHandler(async (req, res, next) => {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
        return next(new ErrorResponse('Please provide latitude and longitude', 400));
    }

    const restaurants = await Restaurant.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                $maxDistance: radius * 1000 // Convert km to meters
            }
        }
    }).populate('menu');

    res.status(200).json({
        success: true,
        count: restaurants.length,
        data: restaurants
    });
});

// @desc    Get restaurant stats
// @route   GET /api/restaurants/:id/stats
// @access  Private
exports.getRestaurantStats = asyncHandler(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        return next(new ErrorResponse('Restaurant not found', 404));
    }

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to view stats`, 401));
    }

    // Get restaurant stats (you can customize this based on your needs)
    const stats = {
        totalOrders: 0, // You'll need to implement this
        totalRevenue: 0, // You'll need to implement this
        averageRating: restaurant.averageRating,
        totalReviews: restaurant.reviews ? restaurant.reviews.length : 0
    };

    res.status(200).json({
        success: true,
        data: stats
    });
});
