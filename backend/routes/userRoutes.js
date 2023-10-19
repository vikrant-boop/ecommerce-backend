const express = require("express");
const { registerUser,loginuser,logout, forgetPassword,resetPassword,getuserdetails,updatepasssword,updateprofile,getSingleUsers,getAllUsers,updateRole,deleteUser} = require("../controllers/userController");
const {isAuthenticatedUSer ,authorizeRoles} = require("../middleware/auth");

const router =express.Router() ;

router.route("/register").post(registerUser) ;
router.route("/login").post(loginuser) ;
router.route("/logout").get(logout) ;
router.route("/password/forgot").post(forgetPassword)  ;
router.route("/password/reset/:token").put(resetPassword) ;
router.route("/me").get(isAuthenticatedUSer, getuserdetails) ;
router.route("/password/update").put(isAuthenticatedUSer ,updatepasssword) ;
router.route("/me/update").put(isAuthenticatedUSer ,updateprofile) ;
router.route("/admin/users").get(isAuthenticatedUSer,authorizeRoles("admin") ,getAllUsers)
router.route("/admin/user/:id").get(isAuthenticatedUSer,authorizeRoles("admin"),getSingleUsers)
router.route("/admin/user/:id").put(isAuthenticatedUSer,authorizeRoles("admin"),updateRole)
router.route("/admin/user/:id").delete(isAuthenticatedUSer,authorizeRoles("admin"),deleteUser) ;





module.exports =router  