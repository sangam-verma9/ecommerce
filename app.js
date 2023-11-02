const express = require("express");
const cookiep = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

//add environment variable
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const app = express();
app.use(express.json());
app.use(cookiep());


//-------------
const cors = require("cors");

// app.use(cors({ origin: "*" }));
app.use(
  cors({
    origin: "https://ecommerce-sangam.netlify.app",
    credentials: true,
    methods: "GET, POST, PUT, DELETE, OPTIONS, HEAD",
    headers:
      "Origin, X-Requested-With, Content-Type, Accept, Engaged-Auth-Token",
  })
);
//------------

//-------------

// Add headers
// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "https://ecommerce-sangam.netlify.app"
//   );

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // Pass to next layer of middleware
//   next();
// });
//---------------

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

const product = require("./routes/productroute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const errormiddleware = require("./middleware/error");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);
//error middleware use
app.use(errormiddleware);

module.exports = app;
