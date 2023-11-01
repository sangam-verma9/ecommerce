const app = require("./app");
const connectdb = require("./database/db");
const cloudinary =require ("cloudinary")

//add environment variable
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

//-------------
const cors = require("cors");

app.use(cors({ origin: "*" }));
// app.use(cors({ origin: "https://ecommerce-sangam.netlify.app" }));
//------------

//-------------

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
//---------------

//uncaught error ** such as you type console.log(sangam) but sangam not defied 
//so we want to close server at upper so here we define upper
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log("sutting down the server due to unhandled promice rejection");
  process.exit(1);
});

//connect database
connectdb();

//add cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`server is listening at port no ${PORT}...`);
  //   console.log(`server is listening at port no 5000...`);
});

//unhandled promice rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log("sutting down the server due to unhandled promice rejection");
  server.close(() => {
    process.exit(1);
  });
});
