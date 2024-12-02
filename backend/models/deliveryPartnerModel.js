const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const deliveryPartnerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    vehicleType: {
        type: String,
        enum: ['BIKE', 'SCOOTER', 'BICYCLE', 'CAR'],
        required: [true, 'Please specify vehicle type']
    },
    vehicleNumber: {
        type: String,
        required: [true, 'Please add vehicle number'],
        unique: true
    },
    licenseNumber: {
        type: String,
        required: [true, 'Please add license number'],
        unique: true
    },
    currentLocation: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    documents: {
        idProof: {
            type: String,
            required: [true, 'Please upload ID proof']
        },
        drivingLicense: {
            type: String,
            required: [true, 'Please upload driving license']
        },
        vehicleRegistration: {
            type: String,
            required: [true, 'Please upload vehicle registration']
        },
        insurance: {
            type: String,
            required: [true, 'Please upload insurance document']
        }
    },
    bankDetails: {
        accountNumber: {
            type: String,
            required: [true, 'Please add bank account number']
        },
        ifscCode: {
            type: String,
            required: [true, 'Please add IFSC code']
        },
        accountHolderName: {
            type: String,
            required: [true, 'Please add account holder name']
        },
        bankName: {
            type: String,
            required: [true, 'Please add bank name']
        }
    },
    ratings: [{
        order: {
            type: mongoose.Schema.ObjectId,
            ref: 'Order'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    totalDeliveries: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    activeOrder: {
        type: mongoose.Schema.ObjectId,
        ref: 'Order',
        default: null
    },
    workingHours: [{
        day: {
            type: String,
            enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
        },
        shifts: [{
            startTime: String,
            endTime: String
        }]
    }]
}, {
    timestamps: true
});

// Create 2dsphere index for location based queries
deliveryPartnerSchema.index({ 'currentLocation': '2dsphere' });

// Calculate average rating before saving
deliveryPartnerSchema.pre('save', async function(next) {
    if (this.ratings.length > 0) {
        this.averageRating = this.ratings.reduce((acc, item) => item.rating + acc, 0) / this.ratings.length;
    }
    next();
});

// Update delivery partner stats after order completion
deliveryPartnerSchema.methods.updateStats = async function(orderAmount) {
    this.totalDeliveries += 1;
    this.totalEarnings += orderAmount;
    return this.save();
};

// Update current location
deliveryPartnerSchema.methods.updateLocation = async function(coordinates) {
    this.currentLocation = {
        type: 'Point',
        coordinates: coordinates
    };
    return this.save();
};

// Toggle availability status
deliveryPartnerSchema.methods.toggleAvailability = async function() {
    this.isAvailable = !this.isAvailable;
    return this.save();
};

// Assign active order
deliveryPartnerSchema.methods.assignOrder = async function(orderId) {
    if (this.activeOrder) {
        throw new Error('Delivery partner already has an active order');
    }
    this.activeOrder = orderId;
    this.isAvailable = false;
    return this.save();
};

// Complete active order
deliveryPartnerSchema.methods.completeOrder = async function() {
    this.activeOrder = null;
    this.isAvailable = true;
    return this.save();
};

const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema);

module.exports = DeliveryPartner;
