const express = require("express");
const { isAuthUser } = require("../middleware/auth");
const { processPayment, sendStripeApiKey, sendsangam } = require("../controllers/paymentController");
const router = express.Router();

router.route("/payment/process").post(isAuthUser, processPayment);
router.route("/stripeapikey").get(isAuthUser, sendStripeApiKey);
module.exports = router;
 