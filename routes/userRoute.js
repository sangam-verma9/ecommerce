const express = require("express");
const {
  registeruser,
  loginuser,
  userlogout,
  forgotPassword,
  resetPassword,
  getuserdetails,
  updatepassword,
  updateuser,
  userdetails,
  getAlluser,
  changeRole,
  deleteUser,
} = require("../controllers/userController");
const { isAuthUser, authRole } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registeruser);
router.route("/login").post(loginuser);
router.route("/forgot/password").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").post(userlogout);
router.route("/me").get(isAuthUser, getuserdetails);
router.route("/me/update").put(isAuthUser, updateuser);
router.route("/password/update").put(isAuthUser, updatepassword);
router.route("/admin/users").get(isAuthUser, authRole("admin"), getAlluser);
router
  .route("/admin/user/:id")
  .get(isAuthUser, authRole("admin"), userdetails)
  .put(isAuthUser, authRole("admin"), changeRole)
  .delete(isAuthUser, authRole("admin"), deleteUser);
module.exports = router;
