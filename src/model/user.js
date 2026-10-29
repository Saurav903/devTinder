const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName:{
    type:String,
    required:true,
    // index:true,
    minLength:4,
    maxLength:50
  },
  lastName:{
    type:String
  },
  email:{
    type:String,
    lowercase:true,
    required:true,
    unique:true,
    trim:true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Is not valid email");
      }
    }
  },
  password:{
    type:String,
    required:true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("Enter a strong password");
      }
    }
  },
  age:{
    type:Number,
    min:18,
    max:70
  },
  gender:{
    type:String,
    enum:{
      values:['male','female','others'],
      message:`{VALUE} incorrect gender`
    },
    validate(value){
      if(!['male','female','others'].includes(value)){
        throw new Error("Gender data is not validate");
      }
    }
  },
  photoUrl:{
    type:String,
    default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9Qd0e_lK5wuOTP3_fZ-QynqZUdpEAdc1IwexeP5qp_g&s=10",
    validate(value){
      if(!validator.isURL(value)){
        throw new Error("Invalid url" + value);
      }
    }
  },
  about:{
    type: String,
    default:"This is default about of this"
  },
  skills:{
    type:[String],
    default:["football","cricket"]
  }
},{timestamps:true});

userSchema.index({firstName:1,lastName:1});

// Helper method for token off load here and always use normal function.
userSchema.methods.getJWT = async function (){
  const user = this;
  const token = await jwt.sign({_id:user._id},"DEV@Tinder007",{
    expiresIn:"7d"
  });

  return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
  const user = this;
  const passwordHash = user.password;
  const passwordValid = await bcrypt.compare(passwordInputByUser,passwordHash);
  return passwordValid;
}


const User = mongoose.model("User",userSchema);

module.exports = User;