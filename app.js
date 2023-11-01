const express = require("express");
const cookiep = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

//add environment variable
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });

const app = express();
app.use(express.json());
app.use(cookiep());

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
