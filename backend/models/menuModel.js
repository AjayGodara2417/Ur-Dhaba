const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add item name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add item description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add item price'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Please specify item category'],
        enum: [
            'Starters',
            'Main Course',
            'Breads',
            'Rice',
            'Desserts',
            'Beverages',
            'Soups',
            'Salads',
            'Snacks',
            'Thali',
            'Combos'
        ]
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    isVeg: {
        type: Boolean,
        required: [true, 'Please specify if item is vegetarian']
    },
    spicyLevel: {
        type: String,
        enum: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
        default: 'Medium'
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    preparationTime: {
        type: Number,
        required: [true, 'Please specify preparation time in minutes'],
        min: [1, 'Preparation time must be at least 1 minute']
    },
    customization: [{
        name: {
            type: String,
            required: true
        },
        options: [{
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true,
                min: 0
            }
        }]
    }],
    nutritionInfo: {
        calories: Number,
        protein: Number,
        carbohydrates: Number,
        fats: Number,
        fiber: Number
    },
    allergens: [{
        type: String,
        enum: [
            'Milk',
            'Eggs',
            'Fish',
            'Shellfish',
            'Tree nuts',
            'Peanuts',
            'Wheat',
            'Soy'
        ]
    }],
    tags: [String],
    popularity: {
        type: Number,
        default: 0
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    }
});

const menuSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    categories: [{
        name: {
            type: String,
            required: [true, 'Please add category name'],
            trim: true
        },
        description: String,
        image: String,
        isAvailable: {
            type: Boolean,
            default: true
        },
        displayOrder: {
            type: Number,
            default: 0
        }
    }],
    items: [menuItemSchema],
    specialOffers: [{
        name: {
            type: String,
            required: true
        },
        description: String,
        discount: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        validFrom: Date,
        validUntil: Date,
        applicableItems: [{
            type: mongoose.Schema.ObjectId,
            ref: 'MenuItem'
        }],
        isActive: {
            type: Boolean,
            default: true
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Middleware to update lastUpdated
menuSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

// Methods to manage menu items
menuSchema.methods.addItem = function(itemData) {
    this.items.push(itemData);
    return this.save();
};

menuSchema.methods.updateItem = function(itemId, updateData) {
    const item = this.items.id(itemId);
    if (!item) throw new Error('Menu item not found');
    
    Object.assign(item, updateData);
    return this.save();
};

menuSchema.methods.removeItem = function(itemId) {
    this.items.pull(itemId);
    return this.save();
};

menuSchema.methods.toggleItemAvailability = function(itemId) {
    const item = this.items.id(itemId);
    if (!item) throw new Error('Menu item not found');
    
    item.isAvailable = !item.isAvailable;
    return this.save();
};

menuSchema.methods.updateItemPopularity = function(itemId, orderCount) {
    const item = this.items.id(itemId);
    if (!item) throw new Error('Menu item not found');
    
    item.popularity += orderCount;
    return this.save();
};

// Create indexes
menuSchema.index({ 'items.name': 'text', 'items.description': 'text' });
menuSchema.index({ 'items.category': 1 });
menuSchema.index({ 'items.isAvailable': 1 });
menuSchema.index({ 'items.isVeg': 1 });
menuSchema.index({ restaurant: 1 });

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
