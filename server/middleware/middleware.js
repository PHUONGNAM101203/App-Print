const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const userModel = require("../models/users.model");

// Check if user is logged in
exports.loginCheck = (req, res, next) => {
  try {
    let token = req.headers.token;
    token = token.replace("Bearer ", "");
    decode = jwt.verify(token, JWT_SECRET);
    req.userDetails = decode;
    next();
  } catch (err) {
    res.json({
      error: "You must be logged in",
    });
  }
};

// Check if the logged-in user matches the request user
exports.isAuth = (req, res, next) => {
  let { loggedInUserId } = req.body;
  if (
    !loggedInUserId ||
    !req.userDetails._id ||
    loggedInUserId != req.userDetails._id
  ) {
    return res.status(403).json({ error: "You are not authenticated" });
  }
  next();
};

// Check if the user is an Admin
exports.isAdmin = async (req, res, next) => {
  try {
    let reqUser = await userModel.findById(req.body.loggedInUserId);
    if (reqUser.userRole !== 1) {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }
    next();
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
};

// Check if the user is a ShopOwner
exports.isShopOwner = async (req, res, next) => {
  try {
    let reqUser = await userModel.findById(req.body.loggedInUserId);
    if (reqUser.userRole !== 2) {
      return res.status(403).json({ error: "Access denied. Shop owner only." });
    }
    next();
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
};
