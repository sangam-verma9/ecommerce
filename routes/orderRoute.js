const express = require("express");
const {
  myorders,
  neworder,
  getsingleorder,
  getallorders,
  updateorder,
  deleteorder,
} = require("../controllers/orderController");
const { isAuthUser, authRole } = require("../middleware/auth");
const router = express.Router();

router.route("/order/new").post(isAuthUser, neworder);
router.route("/order/me").get(isAuthUser, myorders);
router.route("/order/:id").get(isAuthUser, getsingleorder);
router.route("/admin/orders").get(isAuthUser, authRole("admin"), getallorders);
router
  .route("/admin/order/:id")
  .put(isAuthUser, authRole("admin"), updateorder)
  .delete(isAuthUser, authRole("admin"), deleteorder);
module.exports = router;
