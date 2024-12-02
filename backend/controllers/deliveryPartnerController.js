const asyncHandler = require('express-async-handler');
const DeliveryPartner = require('../models/deliveryPartnerModel');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all delivery partners
// @route   GET /api/delivery-partners
// @access  Private/Admin
exports.getDeliveryPartners = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};

    // Filter by availability
    if (req.query.isAvailable) {
        query.isAvailable = req.query.isAvailable === 'true';
    }

    // Filter by verification status
    if (req.query.isVerified) {
        query.isVerified = req.query.isVerified === 'true';
    }

    // Filter by vehicle type
    if (req.query.vehicleType) {
        query.vehicleType = req.query.vehicleType.toUpperCase();
    }

    // Find nearby delivery partners
    if (req.query.latitude && req.query.longitude) {
        const radius = parseInt(req.query.radius, 10) || 10000; // Default 10km radius
        query.currentLocation = {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(req.query.longitude), parseFloat(req.query.latitude)]
                },
                $maxDistance: radius
            }
        };
    }

    const partners = await DeliveryPartner.find(query)
        .populate('user', 'name email phone')
        .skip(startIndex)
        .limit(limit)
        .sort('-createdAt');

    const total = await DeliveryPartner.countDocuments(query);

    res.status(200).json({
        success: true,
        count: partners.length,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        data: partners
    });
});

// @desc    Get single delivery partner
// @route   GET /api/delivery-partners/:id
// @access  Private
exports.getDeliveryPartner = asyncHandler(async (req, res) => {
    const partner = await DeliveryPartner.findById(req.params.id)
        .populate('user', 'name email phone')
        .populate('activeOrder');

    if (!partner) {
        throw new ErrorResponse(`Delivery partner not found with id of ${req.params.id}`, 404);
    }

    res.status(200).json({
        success: true,
        data: partner
    });
});

// @desc    Create delivery partner
// @route   POST /api/delivery-partners
// @access  Private
exports.createDeliveryPartner = asyncHandler(async (req, res) => {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check if user already registered as delivery partner
    const existingPartner = await DeliveryPartner.findOne({ user: req.user.id });

    if (existingPartner) {
        throw new ErrorResponse('User already registered as delivery partner', 400);
    }

    const partner = await DeliveryPartner.create(req.body);

    res.status(201).json({
        success: true,
        data: partner
    });
});

// @desc    Update delivery partner
// @route   PUT /api/delivery-partners/:id
// @access  Private
exports.updateDeliveryPartner = asyncHandler(async (req, res) => {
    let partner = await DeliveryPartner.findById(req.params.id);

    if (!partner) {
        throw new ErrorResponse(`Delivery partner not found with id of ${req.params.id}`, 404);
    }

    // Make sure user is delivery partner owner
    if (partner.user.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new ErrorResponse('Not authorized to update this profile', 401);
    }

    partner = await DeliveryPartner.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: partner
    });
});

// @desc    Update location
// @route   PATCH /api/delivery-partners/:id/location
// @access  Private
exports.updateLocation = asyncHandler(async (req, res) => {
    const { coordinates } = req.body;
    let partner = await DeliveryPartner.findById(req.params.id);

    if (!partner) {
        throw new ErrorResponse(`Delivery partner not found with id of ${req.params.id}`, 404);
    }

    // Make sure user is delivery partner owner
    if (partner.user.toString() !== req.user.id) {
        throw new ErrorResponse('Not authorized to update location', 401);
    }

    partner = await partner.updateLocation(coordinates);

    res.status(200).json({
        success: true,
        data: partner
    });
});

// @desc    Toggle availability
// @route   PATCH /api/delivery-partners/:id/toggle-availability
// @access  Private
exports.toggleAvailability = asyncHandler(async (req, res) => {
    let partner = await DeliveryPartner.findById(req.params.id);

    if (!partner) {
        throw new ErrorResponse(`Delivery partner not found with id of ${req.params.id}`, 404);
    }

    // Make sure user is delivery partner owner
    if (partner.user.toString() !== req.user.id) {
        throw new ErrorResponse('Not authorized to update availability', 401);
    }

    partner = await partner.toggleAvailability();

    res.status(200).json({
        success: true,
        data: partner
    });
});

// @desc    Get delivery partner stats
// @route   GET /api/delivery-partners/:id/stats
// @access  Private
exports.getStats = asyncHandler(async (req, res) => {
    const partner = await DeliveryPartner.findById(req.params.id);

    if (!partner) {
        throw new ErrorResponse(`Delivery partner not found with id of ${req.params.id}`, 404);
    }

    // Make sure user is delivery partner owner or admin
    if (partner.user.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new ErrorResponse('Not authorized to view stats', 401);
    }

    const stats = {
        totalDeliveries: partner.totalDeliveries,
        totalEarnings: partner.totalEarnings,
        averageRating: partner.averageRating,
        totalRatings: partner.ratings.length,
        isAvailable: partner.isAvailable,
        activeOrder: partner.activeOrder
    };

    res.status(200).json({
        success: true,
        data: stats
    });
});
