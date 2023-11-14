const sendToken = (user, statuscode, res) => {
  const token = user.generatejwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COKKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    secure: true, // set to true if your using https or samesite is none
    httpOnly: true, // backend only
    sameSite: "lax", // set to none for cross-request
    path: "/",
    // domain: ".onrender.com",
  };
  res.set_cookie(
    key = "token",
    value = token,
    secure= true, // set to true if your using https or samesite is none
    httpOnly= true, // backend only
    sameSite= "lax", // set to none for cross-request
    path= "/",
    expires= new Date(
      Date.now() + process.env.COKKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
  );
  res.status(statuscode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
