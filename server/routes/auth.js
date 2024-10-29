const {
    isAdminAuth,
    allUser,
    postSignin,
    postSignup,
    isShopOwnerAuth,
  } = require("../controller/auth.controller.js");
  const express = require("express");
  const router = express.Router();
  // const authController = require("../controller/auth");
  const {
    loginCheck,
    isAuth,
    isAdmin,
  } = require("../middleware/auth.middleware.js");
  
  router.post("/isadmin", isAdminAuth);
  router.post("/isshopowner", isShopOwnerAuth);
  router.post("/signup", postSignup);
  router.post("/signin", postSignin);
  router.post("/user", loginCheck, isAuth, isAdmin, allUser);
  
  module.exports = router;
  