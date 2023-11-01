const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter name"],
    minLength: [4, "name should not less than 3 character"],
    maxLength: [30, "name should not max than 30 character"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: [validator.isEmail, "please enter correct email address"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "password should be greater or equal to 8 character"],
    select: false, // means if any one want to access from database then password not return with whole data
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // if we not modify password then not hash again
    next();
  }
  this.password = await bcryptjs.hash(this.password, 10);
});

//generate jwt token
userSchema.methods.generatejwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//password match
userSchema.methods.passwordCompare = async function (enteredpassword) {
  return await bcryptjs.compare(enteredpassword, this.password);
};

//generating password reaset token
userSchema.methods.getResetPasswordToken = function () {
  //generate token
  const resetToken = crypto.randomBytes(20).toString("hex");
  //hashing and adding reasetpassword token to userschema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("user", userSchema);
