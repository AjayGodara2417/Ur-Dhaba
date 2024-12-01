const Order = require('../models/orderModel');
const Restaurant = require('../models/restaurantModel');
const ErrorHandler = require('../utils/errorHandler');

// Create new order
exports.createOrder = async (req, res, next) => {
    try {
        req.body.customer = req.user.id;
        const order = await Order.create(req.body);

        res.status(201).json({
            success: true,
            order
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// Get single order
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name email phone')
            .populate('restaurant', 'name phone')
            .populate('deliveryPartner', 'name phone');

        if (!order) {
            return next(new ErrorHandler('Order not found', 404));
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// Get logged in user orders
exports.myOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ customer: req.user.id })
            .populate('restaurant', 'name')
            .populate('deliveryPartner', 'name phone');

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// Get restaurant orders
exports.getRestaurantOrders = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findOne({ owner: req.user.id });
        
        if (!restaurant) {
            return next(new ErrorHandler('Restaurant not found', 404));
        }

        const orders = await Order.find({ restaurant: restaurant._id })
            .populate('customer', 'name phone')
            .populate('deliveryPartner', 'name phone');

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// Update order status
exports.updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(new ErrorHandler('Order not found', 404));
        }

        if (order.status === 'delivered') {
            return next(new ErrorHandler('Order has already been delivered', 400));
        }

        order.status = req.body.status;
        
        if (req.body.status === 'delivered') {
            order.deliveredAt = Date.now();
        }

        // Add tracking detail
        order.trackingDetails.push({
            status: req.body.status,
            timestamp: Date.now(),
            description: req.body.description || `Order ${req.body.status}`
        });

        await order.save();

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// Assign delivery partner
exports.assignDeliveryPartner = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(new ErrorHandler('Order not found', 404));
        }

        order.deliveryPartner = req.body.deliveryPartnerId;
        order.status = 'picked';
        
        order.trackingDetails.push({
            status: 'picked',
            timestamp: Date.now(),
            description: 'Order picked up by delivery partner'
        });

        await order.save();

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// Get delivery partner orders
exports.getDeliveryPartnerOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ 
            deliveryPartner: req.user.id,
            status: { $in: ['picked', 'delivered'] }
        })
            .populate('customer', 'name phone')
            .populate('restaurant', 'name address phone');

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
