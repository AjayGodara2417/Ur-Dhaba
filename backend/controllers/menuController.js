const Menu = require('../models/menuModel');
const Restaurant = require('../models/restaurantModel');
const ErrorHandler = require('../utils/errorHandler');

// Get restaurant menu
exports.getRestaurantMenu = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;

        const menu = await Menu.findOne({ restaurant: restaurantId })
            .populate('items');

        if (!menu) {
            return next(new ErrorHandler('Menu not found', 404));
        }

        res.status(200).json({
            success: true,
            menu
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// Add menu item
exports.addMenuItem = async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const menuItem = req.body;

        const menu = await Menu.findOne({ restaurant: restaurantId });

        if (!menu) {
            return next(new ErrorHandler('Menu not found', 404));
        }

        menu.items.push(menuItem);
        await menu.save();

        const populatedMenu = await Menu.findById(menu._id).populate('items');

        res.status(201).json({
            success: true,
            menuItem: populatedMenu.items[populatedMenu.items.length - 1]
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// Update menu item
exports.updateMenuItem = async (req, res, next) => {
    try {
        const { restaurantId, itemId } = req.params;
        const updates = req.body;

        const menu = await Menu.findOne({ restaurant: restaurantId });

        if (!menu) {
            return next(new ErrorHandler('Menu not found', 404));
        }

        const item = menu.items.id(itemId);
        if (!item) {
            return next(new ErrorHandler('Item not found', 404));
        }

        Object.assign(item, updates);
        await menu.save();

        const updatedMenu = await Menu.findById(menu._id).populate('items');
        const updatedItem = updatedMenu.items.find(item => item._id.toString() === itemId);

        res.status(200).json({
            success: true,
            menuItem: updatedItem
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// Delete menu item
exports.deleteMenuItem = async (req, res, next) => {
    try {
        const { restaurantId, itemId } = req.params;

        const menu = await Menu.findOne({ restaurant: restaurantId });

        if (!menu) {
            return next(new ErrorHandler('Menu not found', 404));
        }

        menu.items = menu.items.filter(item => item._id.toString() !== itemId);
        await menu.save();

        res.status(200).json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// Toggle item availability
exports.toggleItemAvailability = async (req, res, next) => {
    try {
        const { restaurantId, itemId } = req.params;

        const menu = await Menu.findOne({ restaurant: restaurantId });

        if (!menu) {
            return next(new ErrorHandler('Menu not found', 404));
        }

        const item = menu.items.id(itemId);
        if (!item) {
            return next(new ErrorHandler('Item not found', 404));
        }

        item.isAvailable = !item.isAvailable;
        await menu.save();

        const updatedMenu = await Menu.findById(menu._id).populate('items');
        const updatedItem = updatedMenu.items.find(item => item._id.toString() === itemId);

        res.status(200).json({
            success: true,
            menuItem: updatedItem
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};
