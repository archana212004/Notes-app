require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

// Validate environment variables
const mongoURI = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

if (!mongoURI || !jwtSecret) {
  console.error("Missing required environment variables!");
  process.exit(1);
}

// Connect to MongoDB Atlas
async function connectDB() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:", err);
    process.exit(1);
  }
}
connectDB();

// User Model
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  })
);

// Signup Route
app.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullname, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, fullname: newUser.fullname },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.json({ token, fullname: newUser.fullname });
  } catch (error) {
    res.status(500).json({ error: "Server error!" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials!" });

    const token = jwt.sign(
      { userId: user._id, fullname: user.fullname },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.json({ token, fullname: user.fullname });
  } catch (error) {
    res.status(500).json({ error: "Server error!" });
  }
});

// Start Server
const PORT = process.env.PORT || 5008;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
