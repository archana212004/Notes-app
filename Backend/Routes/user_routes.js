const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/user_model');

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Validation
        if (!fullname?.trim()) {
            return res.status(400).json({
                success: false,
                error: "Full name is required"
            });
        }

        if (!email?.trim()) {
            return res.status(400).json({
                success: false,
                error: "Email is required"
            });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                error: "Password must be at least 6 characters long"
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "Email already registered"
            });
        }

        // Create new user
        const user = new User({
            fullname: fullname.trim(),
            email: email.toLowerCase().trim(),
            password
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id, fullname: user.fullname },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: {
                fullname: user.fullname,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: "Email already registered"
            });
        }
        res.status(500).json({
            success: false,
            error: "Registration failed",
            details: error.message
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email?.trim() || !password) {
            return res.status(400).json({
                success: false,
                error: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({
                success: false,
                error: "Invalid email or password"
            });
        }

        // Verify password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                error: "Invalid email or password"
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, fullname: user.fullname },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                fullname: user.fullname,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: "Login failed",
            details: error.message
        });
    }
});

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Access denied. No token provided."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch profile",
            details: error.message
        });
    }
});

module.exports = router; 