const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true,
        enum: ['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'Continental', 'Fast Food']
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        coordinates: {
            lat: {
                type: Number,
                required: true
            },
            lng: {
                type: Number,
                required: true
            }
        }
    },
    images: {
        cover: {
            type: String,
            required: true
        },
        gallery: [String]
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        total: {
            type: Number,
            default: 0
        },
        distribution: {
            1: { type: Number, default: 0 },
            2: { type: Number, default: 0 },
            3: { type: Number, default: 0 },
            4: { type: Number, default: 0 },
            5: { type: Number, default: 0 }
        }
    },
    priceRange: {
        type: String,
        required: true,
        enum: ['₹', '₹₹', '₹₹₹', '₹₹₹₹']
    },
    deliveryInfo: {
        estimatedTime: {
            min: {
                type: Number,
                required: true
            },
            max: {
                type: Number,
                required: true
            }
        },
        radius: {
            type: Number,
            required: true,
            default: 5 // in kilometers
        },
        fee: {
            type: Number,
            required: true,
            default: 0
        },
        minimumOrder: {
            type: Number,
            required: true,
            default: 0
        }
    },
    status: {
        isOpen: {
            type: Boolean,
            default: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        acceptingOrders: {
            type: Boolean,
            default: true
        },
        temporarilyClosed: {
            type: Boolean,
            default: false
        },
        closedUntil: {
            type: Date
        }
    },
    operatingHours: {
        monday: { 
            isOpen: { type: Boolean, default: true },
            shifts: [{
                open: String,
                close: String
            }]
        },
        tuesday: { 
            isOpen: { type: Boolean, default: true },
            shifts: [{
                open: String,
                close: String
            }]
        },
        wednesday: { 
            isOpen: { type: Boolean, default: true },
            shifts: [{
                open: String,
                close: String
            }]
        },
        thursday: { 
            isOpen: { type: Boolean, default: true },
            shifts: [{
                open: String,
                close: String
            }]
        },
        friday: { 
            isOpen: { type: Boolean, default: true },
            shifts: [{
                open: String,
                close: String
            }]
        },
        saturday: { 
            isOpen: { type: Boolean, default: true },
            shifts: [{
                open: String,
                close: String
            }]
        },
        sunday: { 
            isOpen: { type: Boolean, default: true },
            shifts: [{
                open: String,
                close: String
            }]
        }
    },
    features: {
        hasParking: { type: Boolean, default: false },
        hasAC: { type: Boolean, default: false },
        hasOutdoorSeating: { type: Boolean, default: false },
        servesAlcohol: { type: Boolean, default: false },
        hasWifi: { type: Boolean, default: false },
        acceptsReservations: { type: Boolean, default: false },
        acceptsCard: { type: Boolean, default: true },
        acceptsUPI: { type: Boolean, default: true },
        hasVegOptions: { type: Boolean, default: true }
    },
    tags: [{
        type: String
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true
    },
    bankDetails: {
        accountHolder: String,
        accountNumber: String,
        bankName: String,
        ifscCode: String,
        upiId: String
    },
    documents: {
        fssaiLicense: {
            number: String,
            expiryDate: Date,
            image: String
        },
        gstNumber: String,
        panNumber: String
    },
    contactInfo: {
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        website: String,
        socialMedia: {
            facebook: String,
            instagram: String,
            twitter: String
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for calculating if restaurant is currently open
restaurantSchema.virtual('isCurrentlyOpen').get(function() {
    if (!this.status.isActive || this.status.temporarilyClosed) return false;
    if (this.status.closedUntil && this.status.closedUntil > new Date()) return false;

    const now = new Date();
    const day = now.toLocaleLowerCase();
    const time = now.toLocaleTimeString('en-US', { hour12: false });

    const todaySchedule = this.operatingHours[day];
    if (!todaySchedule.isOpen) return false;

    return todaySchedule.shifts.some(shift => {
        return time >= shift.open && time <= shift.close;
    });
});

// Index for search functionality
restaurantSchema.index({
    name: 'text',
    'description': 'text',
    cuisine: 'text',
    'tags': 'text',
    'address.city': 'text'
});

// Index for geospatial queries
restaurantSchema.index({
    'address.coordinates': '2dsphere'
});

// Index for filtering
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ 'status.isActive': 1 });
restaurantSchema.index({ 'status.acceptingOrders': 1 });
restaurantSchema.index({ 'rating.average': -1 });
restaurantSchema.index({ owner: 1 });

// Methods
restaurantSchema.methods.updateRating = function(newRating) {
    const oldTotal = this.rating.total;
    const oldAverage = this.rating.average;
    
    // Update distribution
    this.rating.distribution[newRating]++;
    
    // Update total and average
    this.rating.total++;
    this.rating.average = (oldTotal * oldAverage + newRating) / this.rating.total;
};

restaurantSchema.methods.toggleStatus = function(statusType) {
    if (this.status.hasOwnProperty(statusType)) {
        this.status[statusType] = !this.status[statusType];
    }
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
