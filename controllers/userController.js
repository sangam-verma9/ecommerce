const Errorhandler = require("../utils/errorHandler");
const catchasyncerror = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmial");
const crypto = require("crypto");

exports.registeruser = catchasyncerror(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is user img id",
      url: "this is user img url",
    },
  });
  // const token = user.generatejwtToken();
  // res.status(201).json({
  //   success: true,
  //   user,
  //   token,
  // });
  sendToken(user, 201, res); // upper commented code can be written like this function
});

exports.loginuser = catchasyncerror(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new Errorhandler("Enter email and password"), 400);
  }
  const user = await User.findOne({ email }).select("+password"); //here select +password bcz password already has defied select false in user schema
  if (!user) {
    return next(new Errorhandler("Invalid user details"), 401);
  }
  const isPasswordMatch = await user.passwordCompare(password);
  if (!isPasswordMatch) {
    return next(new Errorhandler("Invalid user"), 401);
  }
  //   const token = user.generatejwtToken();
  //   res.status(200).json({
  //     success: true,
  //     user,
  //     token,
  //   });
  sendToken(user, 200, res);
});

exports.userlogout = catchasyncerror(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logout successfully",
  });
});

//forget password
exports.forgotPassword = catchasyncerror(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new Errorhandler("user not found"), 404);
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // const resetpasswordurl = `${req.protocol}://${req.get(
  //   "host"
  // )}/password/reset/${resetToken}`;
  const resetpasswordurl = `${process.env.FRONT_URL}/password/reset/${resetToken}`;
  const message = `Your password reset token is : \n\n ${resetpasswordurl} \n If you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Email send successfully`,
      message,
    });
    res.json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new Errorhandler(error.message, 500));
  }
});

// reset password
exports.resetPassword = catchasyncerror(async (req, res, next) => {
  // creating login hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new Errorhandler(
        "Reset password Token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password != req.body.confirmpassword) {
    return next(new Errorhandler("password not matched", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.save();
  sendToken(user, 200, res);
});

//get user details
exports.getuserdetails = catchasyncerror(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id });
  res.status(200).json({
    success: true,
    user,
  });
});

//update password
exports.updatepassword = catchasyncerror(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id }).select("+password");
  const isPasswordMatch = await user.passwordCompare(req.body.oldpassword);
  if (!isPasswordMatch) {
    return next(new Errorhandler("old password not matched", 400));
  }
  if (req.body.newpassword != req.body.confirmpassword) {
    return next(new Errorhandler("password not matched", 400));
  }
  user.password = req.body.newpassword;
  await user.save();
  sendToken(user, 200, res);
});

// update user profile
exports.updateuser = catchasyncerror(async (req, res, next) => {
  const newuserdata = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newuserdata, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
  });
});

//get all users (admin)
exports.getAlluser = catchasyncerror(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//get user details (admin)
exports.userdetails = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new Errorhandler(`user not exists at this ${req.user.id} id`));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//change role of user (admin)
exports.changeRole = catchasyncerror(async (req, res, next) => {
  const newuserdata = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newuserdata, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
  });
});

// delete user (admin)
exports.deleteUser = catchasyncerror(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    next(new Errorhandler(`user not found at this ${req.params.id} id`));
  }
  user.deleteOne();
  res.status(200).json({
    success: true,
    message: "user deleted successfully",
  });
});
