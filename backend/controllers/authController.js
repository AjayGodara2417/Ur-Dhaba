const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const generateToken = require('../utils/jwtToken');

// Register user
exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, password, phone, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(new ErrorHandler('User already exists', 400));
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// Login user
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler('Please enter email and password', 400));
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        const isPasswordMatched = await user.matchPassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// Get user profile
exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        };

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// Update password
exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        const isMatched = await user.matchPassword(req.body.oldPassword);
        if (!isMatched) {
            return next(new ErrorHandler('Old password is incorrect', 400));
        }

        user.password = req.body.newPassword;
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
};

// Logout user
exports.logout = async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};
