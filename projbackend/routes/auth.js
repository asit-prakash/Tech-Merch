const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
router.post(
  "/signup",
  // [
  //   check("name")
  //     .isLength({ min: 3 })
  //     .withMessage("Firstname must be at least 3 character long")
  //     .matches(/^[A-Za-z]+\s{0,1}[a-zA-z]*$/)
  //     .withMessage("Name must contain only letters"),
  //   check("email")
  //     .normalizeEmail()
  //     .isEmail()
  //     .withMessage("Please enter a valid email address"),
  //   check("password")
  //     .isLength({ min: 8 })
  //     .withMessage("Password must be at least 8 character long"),
  // ],
  signup
);

router.post(
  "/signin",
  // [
  //   check("email").normalizeEmail().isEmail().withMessage("Email is required"),
  //   check("password").isLength({ min: 1 }).withMessage("password is required"),
  // ],
  signin
);

router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req, res) => {
  // res.send('A protected route');
  res.json(req.auth);
});

module.exports = router;
