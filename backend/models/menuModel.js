const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String
    },
    category: {
        type: String,
        required: true,
        enum: ['Starters', 'Main Course', 'Breads', 'Rice', 'Desserts', 'Beverages']
    },
    isVegetarian: {
        type: Boolean,
        default: false
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    customization: [{
        name: String,
        options: [{
            name: String,
            price: Number
        }]
    }]
}, {
    timestamps: true
});

const menuSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    items: [menuItemSchema]
}, {
    timestamps: true
});

// Add indexes for better query performance
menuSchema.index({ restaurant: 1 });
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isAvailable: 1 });

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
