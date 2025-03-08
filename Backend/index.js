
require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

const User = require("./Models/user_Model");

const express = require("express");
const cors = require("cors");

const app = express();

const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./utilies");


// MongoDB Connection with Error Handling
mongoose
  .connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Atlas connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Atlas connection error:", err.message);
    process.exit(1); // Exit if connection fails
  });

app.use(express.json());
app.use(cors({ origin: "*" }));

//create Account
app.post("/create-account", async (req, res) => {

    const{fullname, email, password} = req.body;

    if(!fullname){
        return res
        .status(400)
        .json({error:true, message: "Full name is required!!"});
    }

    if(!email){
        return res.status(400).json({error:true, message:"EMail is requied!!"});
    }

    if(!password){
        return res.status(400).json({error: true, message:"Password is requied!!"});
    }

    const isUser = await User.findOne({email:email});

    if(isUser){
        return res.json({
            error:true,
            message: "USer already exist!!",
        });
    }

    const user = new User({
        fullname,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"36000m",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message:"Registration successful",
    });
})

//Login account
app.post('/login', async (req,res) => {
  const{email,password} = req.body;

  if(!email){
    return res.status(400) .json({message: "EMail is reequired!!"});
  }

  if(!password){
    return res.status(400).json({message: "Password is requied!!"});
  }

  constyInfo = await User.findOne({email: email});

  if(!userInfo){
    return res.status(400).json({message: "user not found!!"});
  }

  if(userInfo.email == email && userInfo.password == password){
    const user = {user: userInfo};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn:"3600m"
    });
  }
  else{
    return res.status(400).json({
      error: true,
      message: "Invalid Creadentials",
    })
  }
})

// Test Route
app.get("/", (req, res) => {
  res.json({ data: "Hello world" });
});

// Start Server
const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.use(express.json());
module.exports = app;
