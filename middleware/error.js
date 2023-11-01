const Errorhandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statuscode = err.statuscode || 500;
  err.message = err.message || "Internal serve error";

  // for wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource not found Invalid :${err.path}`;
    err = new Errorhandler(message, 400);
  }
  //mongoose dulicate key error
  // if (err.code === E11000) {
  //   const message = `Dublicate ${Object.keys(err.keyvalue)} Entered`;
  //   return err = new Errorhandler(message, 400);
  // }

  //wrong jwt token
  if (err.name === "JsonWebTokenError") {
    const message = `json web token invalid try again`;
    err = new Errorhandler(message, 400);
  }
  // expire web token
  if (err.name === "TokenExpireError") {
    const message = `json web token Expired try again`;
    err = new Errorhandler(message, 400);
  }

  res.status(err.statuscode).json({
    success: false,
    message: err.message,
    error: err.stack,
  });
};
