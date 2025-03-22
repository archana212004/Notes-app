const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/user_model');

// Signup Route
router.post("/signup", async (req, res) => {
    console.log('📝 Received signup request:', req.body);
    try {
        const { fullname, email, password } = req.body;

        // Enhanced Validation
        if (!fullname?.trim()) {
            return res.status(400).json({ error: "Full name is required" });
        }

        if (!email?.trim()) {
            return res.status(400).json({ error: "Email is required" });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            console.log('⚠️ Email already exists:', email);
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const user = new User({
            fullname: fullname.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        await user.save();
        console.log('✅ User created successfully:', { fullname, email });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, fullname: user.fullname },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(201).json({
            message: "User created successfully",
            token,
            fullname: user.fullname
        });

    } catch (error) {
        console.error("❌ Signup Error:", error);
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email already registered" });
        }
        res.status(500).json({ 
            error: "Server error during signup. Please try again.",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    console.log('🔐 Received login request:', { email: req.body.email });
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log('⚠️ User not found:', email);
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('⚠️ Invalid password for user:', email);
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, fullname: user.fullname },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        console.log('✅ Login successful:', { email, fullname: user.fullname });
        res.json({
            message: "Login successful",
            token,
            fullname: user.fullname
        });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ 
            error: "Server error during login. Please try again.",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router; 