const User = require("../models/userModel");
const Errorhandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");

exports.isAuthUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new Errorhandler("please login or signup to access"), 400);
  }
  const decodedData = jwt.verify(token, process.env.SECRET_KEY);
  req.user = await User.findById(decodedData.id);
  next();
});

exports.authRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Errorhandler(
          `Role of: ${roles} is allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
