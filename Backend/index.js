require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

const User = require("./Models/user_Model");
const Note = require("./Models/note_model");

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilies");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

mongoose
  .connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Atlas connected successfully"))
  .catch((err) => {
    console.error("MongoDB Atlas connection error:", err.message);
    process.exit(1);
  });

app.post("/create-account", async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "All fields are required!!",
    });
  }

  const isUser = await User.findOne({ email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User already exists!!",
    });
  }

  const user = new User({ fullname, email, password });
  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration successful",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Email and password are required!!",
    });
  }

  const userInfo = await User.findOne({ email });

  if (!userInfo) {
    return res.status(400).json({
      error: true,
      message: "User not found!!",
    });
  }

  if (userInfo.password !== password) {
    return res.status(400).json({
      error: true,
      message: "Invalid credentials",
    });
  }

  const user = { user: userInfo };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3600m",
  });

  return res.json({
    error: false,
    message: "Login successful",
    accessToken,
  });
});

//Add Notes
app.post("/add-notes", authenticateToken, async(req, res) =>{
  const{title, content, tags} = req.body;
  const{user} = req.user;

  if(!title){
    return res.status(400).json({error: true, message:"Title is requied!!"})
  }
  if(!content){
    return res
    .status(400)
    .json({error: true, message:"content is required!!"});
  }

  try{
    const note = new Note({
      title,content,
      tags: tags || [],
      userId:user._id,
    });

    await note.save();

    return res.json({
      error:false,
      note,
      message: "Note added Successfully!!",
    });
  }catch(error){
    return res.status(500).json({
      error:true,
      message: "Internal Server Error!",
    });
  }

});


app.get("/", (req, res) => {
  res.json({ data: "Hello world" });
});

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
