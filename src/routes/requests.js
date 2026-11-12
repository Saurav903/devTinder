const express = require("express");
const {userAuth} = require('../middleware/auth.js');
const ConnectionRequest = require("../model/connectionRequest.js");
const User = require("../model/user.js");

const requestRouter = express.Router();

const sentEmail = require("../utils/sendEmail.js")

requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res,next) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["interested","ignore"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message:"Incorrect status",status});
    }

    // Check toUser is present is DB
    const toUser = await User.findById(toUserId);

    if(!toUser){
      return res.status(404).json({message:"User not found"})
    }

    // If same user try to send request to same user so we use schema.pre also this is not mandatory

    // If there is existing connection request from both sides
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or:[
        {fromUserId,toUserId},
        {fromUserId:toUserId,toUserId:fromUserId}
      ],
    });

    if(existingConnectionRequest){
      return res.status(400).json({message:"connection request is already exists"})
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });

    const data = await connectionRequest.save();
    const emailRes = await sentEmail.run("You got friend request from..",req.user.firstName + "is " + status + " in" + toUser.firstName);

    return res.status(200).json({
      message: req.user.firstName + "is " + status + " in" + toUser.firstName,
      data
    })

  } catch (error) {
    return res.status(400).send("Error: "+ error.message);
  }
  // res.send("Connection request sent!")
})

requestRouter.post("/request/review/:status/:requestId", userAuth,async(req,res)=> {
  try {
    const {status,requestId} = req.params;
    const loggedInUser = req.user;
    // Validate the status
    const allowedStatus = ["accepted","rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(404).json({ message:"Invalid not status" });
    }
    const connectionRequest = await ConnectionRequest.findOne({_id:requestId,toUserId:loggedInUser._id,status:"interested"});
    if(!connectionRequest){
      return res.status(404).json({message:"Connection request not found"});
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.status(200).json({message:"Connection request is +" + status,data})

    // toUserId => loggedInUser id
  } catch (error) {
    res.status(400).send("Error: "+ error.message)
  }
  
})

module.exports = requestRouter;