const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");
const userRouter = express.Router();

// Get all pending connection request of the user

const SAFE_DATA_STRING = "firstName lastName age about gender photoUrl skills"

userRouter.get("/user/request/received",userAuth,async (req,res) => {
  try {
     const loggedInUser = req.user
     const connectionRequest = await ConnectionRequest.find({toUserId:loggedInUser._id,status:"interested"}).populate("fromUserId",SAFE_DATA_STRING);

     res.status(200).json({message:"Data fetched successfully",data:connectionRequest});
  } catch (error) {
    res.status.json({message:"Error: "+ error.message});
  }
})

userRouter.get("/user/connections",userAuth,async (req,res) => {
  try {
    const loggedInUser = req.user;
    const connects = await ConnectionRequest.find({
      $or:[
        {toUserId:loggedInUser._id,status:"accepted"},
        {fromUserId:loggedInUser._id,status:"accepted"}
      ]
    }).populate("fromUserId",SAFE_DATA_STRING).populate("toUserId",SAFE_DATA_STRING);
    if(!connects){
      return res.status(404).json({message:"No connections found"})
    }

    const data = await connects?.map((row)=> {
      if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({message:"Got connections successfully",data});
  } catch (error) {
    res.status(400).json({message:"Error: "+ error.message})
  }
});

userRouter.get("/feed",userAuth,async (req,res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit>50 ? 50 : limit;
    const skip = (page-1)*limit;
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or:[
        {fromUserId:loggedInUser._id},
        {toUserId:loggedInUser._id }
      ]
    }).select('fromUserId toUserId')

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req)=>{
      hideUsersFromFeed(req.fromUserId.toString());
      hideUsersFromFeed(req.toUserId.toString());
    });

    const users = await User.find({
      $and:[
      {_id: { $nin: Array.from(hideUsersFromFeed)}},
      {_id: {$ne: loggedInUser._id}}
    ]}).select(SAFE_DATA_STRING).skip(skip).limit(limit)
    res.json({data:users});
  } catch (error) {
    res.status(400).json({message:"Error:"+ error.message})
  }
})

module.exports = userRouter; 