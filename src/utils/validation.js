 const validator = require("validator");
 
 const validateSignUpData = (req)=>{
  const {firstName,lastName,email,password} = req.body;

  if(!firstName || !lastName){
    throw new Error("Not a valid name");
  }
  else if(!validator.isEmail(email)){
    throw new Error("Not an email id"); 
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("The password is not strong");
  }
 };

 const validateEditProfileData = (req)=>{
  const allowedEditFields = ["age","gender","about","skills","photoUrl"];

  const isEditAllowed = Object.keys(req.body).every((item)=> allowedEditFields.includes(item));

  return isEditAllowed;

 }

 module.exports = {
  validateSignUpData,
  validateEditProfileData
 }