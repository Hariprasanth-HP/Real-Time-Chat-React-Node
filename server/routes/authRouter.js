const express = require("express");
const router = express.Router();
const validateForm = require("../controller/validateForm");

const {
  validateSession,
  registerAttempt,
  loginAttempt,
} = require("../controller/authController");
const { rateLimitter } = require("../controller/rateLimitter");
router.post("/register", validateForm, rateLimitter(30, 3), registerAttempt);
router
  .route("/login")
  .get(validateSession)
  .post(validateForm, rateLimitter(60, 10), loginAttempt);
module.exports = router;
