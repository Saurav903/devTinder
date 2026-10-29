const express = require("express");

const app = express();  // this create instences
const {adminAuth} = require("./middleware/auth.js");
// app.use((req,res)=>{
//   res.send("Hello from the server")
// }) // this is function is request handler

// sequence does matter a lot

app.get("/user/:userId",(req,res,next)=>{
  console.log(req.params)
  // res.send({firstName:"kk",lastName:"jj"});
  next();
},
(req,res)=>{
    // route 2
    const auth = req?.body?.token;
    if(auth === "xyz"){
      res.send("second response");
    }else{
      res.status(401).send("Not Authorized to send");
    }
  }
);

app.use("/admin",adminAuth);

app.get("/getUser",(req,res)=>{
  try {
    throw new Error("hjkdjsa");
    res.send("User Data")
  } catch (err) {
    res.status(500).send("hgvmb")
  }
})

app.use("/",(err,req,res,next)=>{ // order matters a lot
  if(err){
    res.status(500).send("Something went wrong");
  }
  res.send("hello from root");
});

// app.post("/signup",async (req,res)=>{

//   // Creating a new instance of the User model
//   const user = new User({
//     firstName:"Virat",
//     lastName:"Kohli",
//     email:"virat@gamil.com",
//     password:"virat123"
//   });

//   try {
//     await user.save();
//     res.send("User added successfully");
//   } catch (error) {
//     res.status(400).send("Error saving user: ",error.message);
//   }
// });


// connectDB()
// .then(()=>{
//   console.log("Database connected successfully");
//   app.listen(3000,()=>{
//   console.log("server is running on 3000")
// });
// }).catch((err)=>{
//   console.log(err);
// })

app.get("/user/:userId",(req,res,next)=>{
  console.log(req.params)
  // res.send({firstName:"kk",lastName:"jj"});
  next();
},
(req,res)=>{
    // route 2
    if(true){

      res.send("second response");
    }else{
      res.status(401).send("Not Authorized to send");
    }
  }
);

app.get("/user",(req,res)=>{
  res.send({firstName:"Saurav",lastName:"Kumar"});
});

app.post("/user",(req,res)=>{
  console.log("save data to database");
  res.send("data saved successfully to database");
});

app.get("/user/:userId",(req,res)=>{
  console.log(req.params)
  res.send({firstName:"kk",lastName:"jj"});
});

app.get("/user",(req,res)=>{
  console.log(req.query)
  res.send({firstName:"Saurav",lastName:"Kumar"});
});

app.delete("/user",(req,res)=>{
  res.send("user data is deleted")
})

app.use("/hello/2",(req,res)=>{
  res.send("hello 2")
})

app.use("hello",(req,res)=>{
  res.send("hello hello");
})

app.use("/test",(req,res)=>{
    res.send("hello from test")
});

app.use("/",(req,res)=>{
  res.send("hello from root");
});

app.listen(3000,()=>{
  console.log("server is running on 3000")
});


// Get user by email
// app.get("/user",async(req,res)=>{
//   const userEmail = req.body.email;
//   try {
//     const user = await User.find({email:userEmail});
//     if(user.length === 0){
//       res.status(404).send("User not found")
//     }else{
//       res.send(user);
//     }
//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// });

// // Get all user to show in feed
// app.get("/feed",async(req,res)=>{
//   try {
//     const users = await User.find({});
//     if(users.length === 0){
//       res.status(404).send("Users not found")
//     }else{
//       res.send(users);
//     }
//   } catch (error) {
//     res.send(error);
//   }
// });

// // delete
// app.delete("/user",async(req,res)=>{
//   const userId = req.body.userId;

//   try {
//     const user = await User.findByIdAndDelete(userId);
//     res.send("deleted successfully");
//   } catch (error) {
//     res.status(400).send("Something went wrong");
//   }
// })

// // Update using patch

// app.patch("/user/:userId",async(req,res)=>{
//   const userId = req.params?.userId;
//   const data = req.body;

//   try {
//     const ALLOWED_UPDATES = ["photoUrl","about","gender","age","skills"];

//   const isUpdatedAllowed = Object.keys(data).every((k)=> ALLOWED_UPDATES.includes(k));
//   if(!isUpdatedAllowed){
//     throw new Error("Update is not allowed");
//   }
//   if(data?.skills.length > 10){
//     throw new Error("Skills not allowed more than 10")
//   }
//     const user = await User.findByIdAndUpdate({_id:userId},data,{
//       returnDocument:"before",
//       runValidators:true, //to run the validation check
//     });
//     console.log(user);
//     res.send("Updated successfully");
//   } catch (error) {
//     res.status(400).send("Something went wrong: "+ error.message);
//   }
// })
