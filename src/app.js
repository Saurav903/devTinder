const express = require("express");
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");

const app = express();  // this create instences

app.use(express.json()); // which wraps up the api getting request body as json.
app.use(cookieParser()); // to handle cookie we need this parser

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/requests.js");
const userRouter = require("./routes/user.js");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

connectDB()
.then(()=>{
  console.log("Database connected successfully");
  app.listen(7777,()=>{
  console.log("server is running on 7777")
});
}).catch((err)=>{
  console.log(err);
})