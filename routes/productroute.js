const express = require("express");

const {
  getAllProducts,
  createproduct,
  updateproduct,
  deleteproduct,
  getproductdetails,
  getsangam,
  createReview,
  getAllreviews,
  deleteReview,
  getAllProducthome,
} = require("../controllers/productcontroller");
const { isAuthUser, authRole } = require("../middleware/auth");
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/products/home").get(getAllProducthome);
router.route("/sangam").get(getsangam);
router
  .route("/admin/products/new")
  .post(isAuthUser, authRole("admin"), createproduct);
router
  .route("/admin/products/:id")
  .put(isAuthUser, authRole("admin"), updateproduct);
router.route("/products/:id").get(getproductdetails);
router
  .route("/admin/products/:id")
  .delete(isAuthUser, authRole("admin"), deleteproduct);
router
  .route("/review")
  .put(isAuthUser, createReview)
  .get(getAllreviews)
  .delete(isAuthUser, authRole("admin"), deleteReview);

module.exports = router;
