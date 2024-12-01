const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    reply: {
        content: String,
        timestamp: Date
    },
    isVisible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Update restaurant rating when a review is added or modified
reviewSchema.post('save', async function() {
    const Restaurant = mongoose.model('Restaurant');
    const restaurant = await Restaurant.findById(this.restaurant);
    
    const Review = this.constructor;
    const stats = await Review.aggregate([
        {
            $match: { restaurant: this.restaurant, isVisible: true }
        },
        {
            $group: {
                _id: null,
                avgRating: { $avg: '$rating' },
                totalRatings: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        restaurant.rating = stats[0].avgRating;
        restaurant.totalRatings = stats[0].totalRatings;
    } else {
        restaurant.rating = 0;
        restaurant.totalRatings = 0;
    }

    await restaurant.save();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
