const asyncHandler = require('express-async-handler');
const Menu = require('../models/menuModel');
const Restaurant = require('../models/Restaurant');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all menus
// @route   GET /api/menus
// @access  Public
exports.getMenus = asyncHandler(async (req, res) => {
    const { restaurant, category, isVeg, search } = req.query;
    const query = {};

    // Build query
    if (restaurant) query.restaurant = restaurant;
    if (category) query['items.category'] = category;
    if (isVeg !== undefined) query['items.isVeg'] = isVeg === 'true';
    if (search) {
        query.$text = { $search: search };
    }

    const menus = await Menu.find(query)
        .populate('restaurant', 'name location')
        .select('-__v');

    res.status(200).json({
        success: true,
        count: menus.length,
        data: menus
    });
});

// @desc    Get single menu
// @route   GET /api/menus/:id
// @access  Public
exports.getMenu = asyncHandler(async (req, res) => {
    const menu = await Menu.findById(req.params.id)
        .populate('restaurant', 'name location')
        .select('-__v');

    if (!menu) {
        throw new ErrorResponse(`Menu not found with id of ${req.params.id}`, 404);
    }

    res.status(200).json({
        success: true,
        data: menu
    });
});

// @desc    Create menu
// @route   POST /api/restaurants/:restaurantId/menu
// @access  Private
exports.createMenu = asyncHandler(async (req, res) => {
    req.body.restaurant = req.params.restaurantId;

    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
        throw new ErrorResponse(
            `Restaurant not found with id of ${req.params.restaurantId}`,
            404
        );
    }

    // Make sure user is restaurant owner
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new ErrorResponse(
            `User ${req.user.id} is not authorized to create a menu for this restaurant`,
            401
        );
    }

    const menu = await Menu.create(req.body);

    res.status(201).json({
        success: true,
        data: menu
    });
});

// @desc    Update menu
// @route   PUT /api/menus/:id
// @access  Private
exports.updateMenu = asyncHandler(async (req, res) => {
    let menu = await Menu.findById(req.params.id);

    if (!menu) {
        throw new ErrorResponse(`Menu not found with id of ${req.params.id}`, 404);
    }

    // Make sure user is restaurant owner
    const restaurant = await Restaurant.findById(menu.restaurant);
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new ErrorResponse(
            `User ${req.user.id} is not authorized to update this menu`,
            401
        );
    }

    menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: menu
    });
});

// @desc    Delete menu
// @route   DELETE /api/menus/:id
// @access  Private
exports.deleteMenu = asyncHandler(async (req, res) => {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
        throw new ErrorResponse(`Menu not found with id of ${req.params.id}`, 404);
    }

    // Make sure user is restaurant owner
    const restaurant = await Restaurant.findById(menu.restaurant);
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new ErrorResponse(
            `User ${req.user.id} is not authorized to delete this menu`,
            401
        );
    }

    await menu.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Add menu item
// @route   POST /api/menus/:id/items
// @access  Private
exports.addMenuItem = asyncHandler(async (req, res) => {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
        throw new ErrorResponse(`Menu not found with id of ${req.params.id}`, 404);
    }

    // Make sure user is restaurant owner
    const restaurant = await Restaurant.findById(menu.restaurant);
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new ErrorResponse(
            `User ${req.user.id} is not authorized to add items to this menu`,
            401
        );
    }

    const updatedMenu = await menu.addItem(req.body);

    res.status(200).json({
        success: true,
        data: updatedMenu
    });
});

// @desc    Update menu item
// @route   PUT /api/menus/:id/items/:itemId
// @access  Private
exports.updateMenuItem = asyncHandler(async (req, res) => {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
        throw new ErrorResponse(`Menu not found with id of ${req.params.id}`, 404);
    }

    // Make sure user is restaurant owner
    const restaurant = await Restaurant.findById(menu.restaurant);
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new ErrorResponse(
            `User ${req.user.id} is not authorized to update items in this menu`,
            401
        );
    }

    const updatedMenu = await menu.updateItem(req.params.itemId, req.body);

    res.status(200).json({
        success: true,
        data: updatedMenu
    });
});

// @desc    Delete menu item
// @route   DELETE /api/menus/:id/items/:itemId
// @access  Private
exports.deleteMenuItem = asyncHandler(async (req, res) => {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
        throw new ErrorResponse(`Menu not found with id of ${req.params.id}`, 404);
    }

    // Make sure user is restaurant owner
    const restaurant = await Restaurant.findById(menu.restaurant);
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new ErrorResponse(
            `User ${req.user.id} is not authorized to delete items from this menu`,
            401
        );
    }

    const updatedMenu = await menu.removeItem(req.params.itemId);

    res.status(200).json({
        success: true,
        data: updatedMenu
    });
});

// @desc    Toggle menu item availability
// @route   PATCH /api/menus/:id/items/:itemId/toggle
// @access  Private
exports.toggleItemAvailability = asyncHandler(async (req, res) => {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
        throw new ErrorResponse(`Menu not found with id of ${req.params.id}`, 404);
    }

    // Make sure user is restaurant owner
    const restaurant = await Restaurant.findById(menu.restaurant);
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new ErrorResponse(
            `User ${req.user.id} is not authorized to update items in this menu`,
            401
        );
    }

    const updatedMenu = await menu.toggleItemAvailability(req.params.itemId);

    res.status(200).json({
        success: true,
        data: updatedMenu
    });
});

// @desc    Add special offer
// @route   POST /api/menus/:id/offers
// @access  Private
exports.addSpecialOffer = asyncHandler(async (req, res) => {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
        throw new ErrorResponse(`Menu not found with id of ${req.params.id}`, 404);
    }

    // Make sure user is restaurant owner
    const restaurant = await Restaurant.findById(menu.restaurant);
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new ErrorResponse(
            `User ${req.user.id} is not authorized to add offers to this menu`,
            401
        );
    }

    menu.specialOffers.push(req.body);
    const updatedMenu = await menu.save();

    res.status(200).json({
        success: true,
        data: updatedMenu
    });
});
