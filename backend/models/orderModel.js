const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    customization: [{
        name: String,
        option: String,
        price: Number
    }]
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    items: [orderItemSchema],
    deliveryAddress: {
        street: {
            type: String,
            required: [true, 'Please add a street address']
        },
        city: {
            type: String,
            required: [true, 'Please add a city']
        },
        state: {
            type: String,
            required: [true, 'Please add a state']
        },
        zipCode: {
            type: String,
            required: [true, 'Please add a zip code']
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point']
            },
            coordinates: [Number]
        }
    },
    contact: {
        name: {
            type: String,
            required: [true, 'Please add a contact name']
        },
        phone: {
            type: String,
            required: [true, 'Please add a contact phone']
        }
    },
    paymentDetails: {
        method: {
            type: String,
            required: true,
            enum: ['CASH', 'CARD', 'UPI', 'WALLET']
        },
        status: {
            type: String,
            enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
            default: 'PENDING'
        },
        transactionId: String,
        paidAt: Date
    },
    orderStatus: {
        type: String,
        enum: [
            'PLACED',
            'CONFIRMED',
            'PREPARING',
            'READY_FOR_PICKUP',
            'OUT_FOR_DELIVERY',
            'DELIVERED',
            'CANCELLED'
        ],
        default: 'PLACED'
    },
    statusHistory: [{
        status: {
            type: String,
            enum: [
                'PLACED',
                'CONFIRMED',
                'PREPARING',
                'READY_FOR_PICKUP',
                'OUT_FOR_DELIVERY',
                'DELIVERED',
                'CANCELLED'
            ]
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        note: String
    }],
    subtotal: {
        type: Number,
        required: true
    },
    taxAmount: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    specialInstructions: String,
    estimatedDeliveryTime: {
        type: Date,
        required: true
    },
    actualDeliveryTime: Date,
    rating: {
        food: {
            type: Number,
            min: 1,
            max: 5
        },
        delivery: {
            type: Number,
            min: 1,
            max: 5
        },
        review: String,
        createdAt: Date
    },
    deliveryPartner: {
        type: mongoose.Schema.ObjectId,
        ref: 'DeliveryPartner'
    }
}, {
    timestamps: true
});

// Add index for location-based queries
orderSchema.index({ 'deliveryAddress.coordinates': '2dsphere' });

// Add index for status-based queries
orderSchema.index({ orderStatus: 1, createdAt: -1 });

// Add index for user queries
orderSchema.index({ user: 1, createdAt: -1 });

// Add index for restaurant queries
orderSchema.index({ restaurant: 1, createdAt: -1 });

// Calculate totals before saving
orderSchema.pre('save', function(next) {
    // Calculate subtotal
    this.subtotal = this.items.reduce((total, item) => {
        const itemTotal = item.price * item.quantity;
        const customizationTotal = item.customization.reduce((sum, custom) => sum + custom.price, 0);
        return total + itemTotal + (customizationTotal * item.quantity);
    }, 0);

    // Calculate tax (assuming 5% tax rate)
    this.taxAmount = this.subtotal * 0.05;

    // Calculate total
    this.total = this.subtotal + this.taxAmount + this.deliveryFee - this.discount;

    next();
});

// Update status history
orderSchema.methods.updateStatus = async function(status, note) {
    this.orderStatus = status;
    this.statusHistory.push({
        status,
        note,
        timestamp: Date.now()
    });

    if (status === 'DELIVERED') {
        this.actualDeliveryTime = Date.now();
    }

    return this.save();
};

// Add rating and review
orderSchema.methods.addRating = async function(rating) {
    if (this.orderStatus !== 'DELIVERED') {
        throw new Error('Cannot rate an undelivered order');
    }

    this.rating = {
        ...rating,
        createdAt: Date.now()
    };

    return this.save();
};

// Virtual for order duration
orderSchema.virtual('orderDuration').get(function() {
    if (!this.actualDeliveryTime) return null;
    return this.actualDeliveryTime - this.createdAt;
});

// Virtual for delivery status
orderSchema.virtual('isDelayed').get(function() {
    if (!this.estimatedDeliveryTime || this.orderStatus === 'DELIVERED') return false;
    return Date.now() > this.estimatedDeliveryTime;
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
