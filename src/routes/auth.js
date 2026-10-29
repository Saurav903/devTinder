const express = require('express');
const User = require("../model/user.js");
const {validateSignUpData} = require("../utils/validation.js");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup",async (req,res)=>{
  // validation of data
  validateSignUpData(req);
  const {firstName,lastName,email,password} = req.body;
  // Encryption of password
  const passwordHash = await bcrypt.hash(password,5)
  // Creating a new instance of the User model
  const user = new User({
    firstName,lastName,email,password:passwordHash
  });
  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Error saving user: "+ error.message);
  }
});

authRouter.post("/login",async(req,res)=>{
  try {
    const {email,password} = req.body;
    const user = await User.findOne({email});

    if(!user){
      throw new Error("Invalid credentials");
    }

    const passwordValid = await user.validatePassword(password);

    if(passwordValid){
      // create the jwt token
      const token = await user.getJWT();
      // add the token to cookie and send it back to user
      res.cookie('token',token,{expires:new Date(Date.now() + 8 * 3600000),httpOnly:true});

      res.send("User Login successfully!!")
    }else{
      throw new Error("Password is not correct");
    }
  } catch (error) {
    res.status(400).send("something went wrong: "+ error.message);
  }
});

authRouter.post("/logout",async(req,res)=>{
  res.cookie("token",null,{
    expires: new Date(Date.now())
  })
  res.status(200).send("user logout successfully");
})

module.exports = authRouter;