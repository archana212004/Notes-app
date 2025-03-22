require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import models first
const User = require('./Models/user_model');
const Note = require('./Models/note_model');

// Import routes after models
const userRoutes = require("./Routes/user_routes");
const noteRoutes = require("./Routes/note_routes");

const app = express();

// CORS Configuration
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Allow both localhost and IP
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5022;

// MongoDB Connection with Retry Logic
const connectWithRetry = async (retryCount = 0, maxRetries = 5) => {
    try {
        console.log('📡 Attempting to connect to MongoDB Atlas...');
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            directConnection: true
        });
        console.log("✅ MongoDB Atlas Connected Successfully");
        return true;
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        if (retryCount < maxRetries) {
            const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
            console.log(`🔄 Retrying connection in ${retryDelay/1000} seconds... (Attempt ${retryCount + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return connectWithRetry(retryCount + 1, maxRetries);
        } else {
            console.error("❌ Max retry attempts reached. Could not connect to MongoDB.");
            return false;
        }
    }
};

let isConnected = false;

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('🟢 MongoDB connection established');
    isConnected = true;
});

mongoose.connection.on('error', (err) => {
    console.error('🔴 MongoDB connection error:', err);
    if (!isConnected) {
        console.log('🔄 Connection was never established');
        return;
    }
    isConnected = false;
});

mongoose.connection.on('disconnected', () => {
    console.log('🟡 MongoDB connection disconnected');
    if (!isConnected) {
        console.log('🔄 Connection was never established');
        return;
    }
    isConnected = false;
});

// Start MongoDB connection
(async () => {
    isConnected = await connectWithRetry();
    if (!isConnected) {
        console.error('❌ Could not establish initial connection to MongoDB');
        process.exit(1);
    }
})();

// Use routes with connection check middleware
const connectionCheckMiddleware = (req, res, next) => {
    if (!isConnected) {
        return res.status(503).json({ error: "Database connection is not ready. Please try again." });
    }
    next();
};

app.use("/api", connectionCheckMiddleware, userRoutes);
app.use("/api/notes", connectionCheckMiddleware, noteRoutes);

// Test route
app.get("/test", async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            throw new Error("Database not connected");
        }
        await mongoose.connection.db.admin().ping();
        res.json({ 
            message: "Backend server is running!",
            dbStatus: "Connected",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Backend server is running but database connection failed",
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Signup Route
app.post("/signup", async (req, res) => {
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
            jwtSecret,
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
app.post("/login", async (req, res) => {
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
            jwtSecret,
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({ 
        error: "Internal server error. Please try again later.",
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`✨ Server is running on port ${PORT}`);
    console.log(`📦 MongoDB Atlas URI: ${mongoURI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")}`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(0);
        });
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});
