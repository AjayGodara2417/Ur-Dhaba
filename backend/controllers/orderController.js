const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Restaurant = require('../models/Restaurant');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};

    // Build query based on role and filters
    if (req.user.role === 'user') {
        query.user = req.user.id;
    } else if (req.user.role === 'restaurant') {
        query.restaurant = req.user.restaurantId;
    } else if (req.user.role === 'delivery') {
        query.deliveryPartner = req.user.id;
    }

    // Status filter
    if (req.query.status) {
        query.orderStatus = req.query.status.toUpperCase();
    }

    // Date range filter
    if (req.query.startDate && req.query.endDate) {
        query.createdAt = {
            $gte: new Date(req.query.startDate),
            $lte: new Date(req.query.endDate)
        };
    }

    const orders = await Order.find(query)
        .populate('restaurant', 'name location')
        .populate('user', 'name email')
        .populate('deliveryPartner', 'name phone')
        .skip(startIndex)
        .limit(limit)
        .sort('-createdAt');

    const total = await Order.countDocuments(query);

    res.status(200).json({
        success: true,
        count: orders.length,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        data: orders
    });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('restaurant', 'name location')
        .populate('user', 'name email')
        .populate('deliveryPartner', 'name phone');

    if (!order) {
        throw new ErrorResponse(`Order not found with id of ${req.params.id}`, 404);
    }

    // Make sure user has access to order
    if (
        req.user.role === 'user' && order.user.toString() !== req.user.id &&
        req.user.role === 'restaurant' && order.restaurant.toString() !== req.user.restaurantId &&
        req.user.role === 'delivery' && order.deliveryPartner.toString() !== req.user.id &&
        req.user.role !== 'admin'
    ) {
        throw new ErrorResponse('Not authorized to access this order', 401);
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc    Create order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res) => {
    req.body.user = req.user.id;

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(req.body.restaurant);
    if (!restaurant) {
        throw new ErrorResponse(`Restaurant not found with id of ${req.body.restaurant}`, 404);
    }

    // Calculate estimated delivery time (30 minutes from now)
    req.body.estimatedDeliveryTime = new Date(Date.now() + 30 * 60000);

    const order = await Order.create(req.body);

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
        .populate('restaurant', 'name location')
        .populate('user', 'name email');

    res.status(201).json({
        success: true,
        data: populatedOrder
    });
});

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = asyncHandler(async (req, res) => {
    const { status, note } = req.body;
    let order = await Order.findById(req.params.id);

    if (!order) {
        throw new ErrorResponse(`Order not found with id of ${req.params.id}`, 404);
    }

    // Check authorization based on status and role
    if (!canUpdateStatus(req.user, order, status)) {
        throw new ErrorResponse('Not authorized to update this order status', 401);
    }

    // Update order status
    order = await order.updateStatus(status, note);

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
        .populate('restaurant', 'name location')
        .populate('user', 'name email')
        .populate('deliveryPartner', 'name phone');

    res.status(200).json({
        success: true,
        data: populatedOrder
    });
});

// @desc    Add order rating
// @route   POST /api/orders/:id/rating
// @access  Private
exports.addOrderRating = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new ErrorResponse(`Order not found with id of ${req.params.id}`, 404);
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user.id) {
        throw new ErrorResponse('Not authorized to rate this order', 401);
    }

    // Add rating
    const updatedOrder = await order.addRating(req.body);

    res.status(200).json({
        success: true,
        data: updatedOrder
    });
});

// @desc    Assign delivery partner
// @route   PATCH /api/orders/:id/assign
// @access  Private/Admin
exports.assignDeliveryPartner = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new ErrorResponse(`Order not found with id of ${req.params.id}`, 404);
    }

    // Only admin can assign delivery partner
    if (req.user.role !== 'admin') {
        throw new ErrorResponse('Not authorized to assign delivery partner', 401);
    }

    order.deliveryPartner = req.body.deliveryPartnerId;
    await order.save();

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
        .populate('restaurant', 'name location')
        .populate('user', 'name email')
        .populate('deliveryPartner', 'name phone');

    res.status(200).json({
        success: true,
        data: populatedOrder
    });
});

// Helper function to check if user can update order status
const canUpdateStatus = (user, order, newStatus) => {
    // Admin can update any status
    if (user.role === 'admin') return true;

    // Restaurant can update status to CONFIRMED, PREPARING, READY_FOR_PICKUP
    if (user.role === 'restaurant' && order.restaurant.toString() === user.restaurantId) {
        return ['CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'].includes(newStatus);
    }

    // Delivery partner can update status to OUT_FOR_DELIVERY, DELIVERED
    if (user.role === 'delivery' && order.deliveryPartner.toString() === user.id) {
        return ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(newStatus);
    }

    // User can only cancel their own order if it's not already being prepared
    if (user.role === 'user' && order.user.toString() === user.id) {
        return newStatus === 'CANCELLED' && !['PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.orderStatus);
    }

    return false;
};
