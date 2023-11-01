const sendToken = (user, statuscode, res) => {
  const token = user.generatejwtToken();
  const options = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COKKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
  };

  res.status(statuscode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
