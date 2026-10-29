const express = require("express");
const {userAuth} = require('../middleware/auth.js');
const {validateEditProfileData} = require("../utils/validation.js");

const profileRouter = express.Router();

profileRouter.get("/profile/view",userAuth,async(req,res)=>{
  try {
    const user = req.user;
    if(!user){
      throw new Error("No user found")
    }
    res.send("reading cookie")
  } catch (error) {
    res.status(400).send("Error: "+ error.message)
  }
});

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try {
      if(!validateEditProfileData(req)){
        throw new Error("Invalid Edit Request");
      }
      const loggedInUser = req.user;
      Object.keys(req.body).forEach((key)=> (loggedInUser[key] = req.body[key]));
      await loggedInUser.save();
      res.status(200).send("User is updated: "+ loggedInUser);
      // res.json({message:`${loggedInUser.firstName}, you data is updated successfully`,data:loggedInUser})
    } catch (error) {
      res.status(400).send("Error: "+ error.message);
    }
})

module.exports = profileRouter;