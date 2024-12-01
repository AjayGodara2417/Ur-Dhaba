const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a restaurant name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    cuisine: {
        type: [String],
        required: [true, 'Please select at least one cuisine type'],
        enum: ['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'Continental', 'Fast Food', 'Street Food', 'Desserts', 'Beverages']
    },
    address: {
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
        location: {
            type: {
                type: String,
                enum: ['Point']
            },
            coordinates: {
                type: [Number],
                index: '2dsphere'
            }
        }
    },
    images: {
        cover: {
            type: String,
            required: [true, 'Please add a cover image']
        },
        gallery: [String]
    },
    menu: {
        type: mongoose.Schema.ObjectId,
        ref: 'Menu',
        required: true
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    reviews: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true,
            maxlength: 500
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    priceRange: {
        type: String,
        required: [true, 'Please specify a price range'],
        enum: ['$', '$$', '$$$', '$$$$']
    },
    isOpen: {
        type: Boolean,
        default: false
    },
    features: {
        delivery: {
            type: Boolean,
            default: true
        },
        takeout: {
            type: Boolean,
            default: true
        },
        dineIn: {
            type: Boolean,
            default: true
        },
        parking: {
            type: Boolean,
            default: false
        },
        outdoorSeating: {
            type: Boolean,
            default: false
        }
    },
    businessHours: {
        monday: {
            open: String,
            close: String,
            isOpen: { type: Boolean, default: true }
        },
        tuesday: {
            open: String,
            close: String,
            isOpen: { type: Boolean, default: true }
        },
        wednesday: {
            open: String,
            close: String,
            isOpen: { type: Boolean, default: true }
        },
        thursday: {
            open: String,
            close: String,
            isOpen: { type: Boolean, default: true }
        },
        friday: {
            open: String,
            close: String,
            isOpen: { type: Boolean, default: true }
        },
        saturday: {
            open: String,
            close: String,
            isOpen: { type: Boolean, default: true }
        },
        sunday: {
            open: String,
            close: String,
            isOpen: { type: Boolean, default: true }
        }
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
            number: {
                type: String,
                required: [true, 'FSSAI license number is required']
            },
            expiryDate: {
                type: Date,
                required: [true, 'FSSAI license expiry date is required']
            },
            image: {
                type: String,
                required: [true, 'FSSAI license image is required']
            }
        },
        gstNumber: String,
        panNumber: {
            type: String,
            required: [true, 'PAN number is required']
        }
    },
    stats: {
        totalOrders: {
            type: Number,
            default: 0
        },
        totalRevenue: {
            type: Number,
            default: 0
        },
        avgOrderValue: {
            type: Number,
            default: 0
        },
        monthlyStats: [{
            month: Date,
            orders: Number,
            revenue: Number
        }]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for location-based queries
restaurantSchema.index({ 'address.location': '2dsphere' });

// Index for text search
restaurantSchema.index({
    name: 'text',
    description: 'text',
    'cuisine': 'text'
});

// Virtual populate reviews
restaurantSchema.virtual('reviewsCount').get(function() {
    return this.reviews.length;
});

// Update average rating
restaurantSchema.methods.updateAverageRating = function() {
    if (this.reviews.length === 0) {
        this.averageRating = 0;
        this.totalReviews = 0;
    } else {
        const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        this.averageRating = Math.round((totalRating / this.reviews.length) * 10) / 10;
        this.totalReviews = this.reviews.length;
    }
    return this.save();
};

// Toggle restaurant status
restaurantSchema.methods.toggleStatus = function(statusType) {
    if (statusType === 'isOpen') {
        this.isOpen = !this.isOpen;
    } else if (this.features.hasOwnProperty(statusType)) {
        this.features[statusType] = !this.features[statusType];
    }
    return this.save();
};

// Update restaurant stats
restaurantSchema.methods.updateStats = async function(order) {
    this.stats.totalOrders += 1;
    this.stats.totalRevenue += order.totalAmount;
    this.stats.avgOrderValue = this.stats.totalRevenue / this.stats.totalOrders;

    const orderMonth = new Date(order.createdAt);
    orderMonth.setDate(1); // Set to first day of month

    const monthStats = this.stats.monthlyStats.find(
        stat => stat.month.getTime() === orderMonth.getTime()
    );

    if (monthStats) {
        monthStats.orders += 1;
        monthStats.revenue += order.totalAmount;
    } else {
        this.stats.monthlyStats.push({
            month: orderMonth,
            orders: 1,
            revenue: order.totalAmount
        });
    }

    return this.save();
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
