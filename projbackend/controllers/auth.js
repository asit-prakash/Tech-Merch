// const { check, validationResult } = require("express-validator");
const validator = require("validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

const User = require("../models/user");

//error handling
const firstName = (fname) => {
  var errorFirstName = "";
  if (fname.length < 3) {
    var errorFirstName = "Firstname must be at least 3 character long";
  }
  if (!validator.matches(fname, /^[A-Za-z]+\s{0,1}[a-zA-z]*$/)) {
    var errorFirstName = "Name must contain only letters";
  }
  return errorFirstName;
};

const lastName = (lname) => {
  var errorLastName = "";
  if (lname.length > 0) {
    if (!validator.matches(lname, /^[A-Za-z]+\s{0,1}[a-zA-z]*$/)) {
      var errorLastName = "Name must contain only letters";
    }
  }
  return errorLastName;
};

const checkemail = (email) => {
  var errorEmail = "";
  if (validator.isEmail(email)) {
    validator.normalizeEmail(email);
  } else {
    var errorEmail = "Please enter a valid email address";
  }
  return errorEmail;
};

const signupPassword = (password) => {
  var errorPassword = "";
  if (password.length < 8) {
    var errorPassword = "Password must be at least 8 character long";
  }
  return errorPassword;
};

const signinPassword = (password) => {
  var errorPassword = "";
  if (password.length < 1) {
    var errorPassword = "Please Enter Password";
  }
  return errorPassword;
};

//signup goes here
exports.signup = (req, res) => {
  var errorFirstName = firstName(req.body.name);
  var errorLastName = lastName(req.body.lastname);
  var errorEmail = checkemail(req.body.email);
  var errorPassword = signupPassword(req.body.password);

  if (errorFirstName || errorLastName || errorEmail || errorPassword !== "") {
    return res.status(422).json({
      errorFirstName: errorFirstName,
      errorLastName: errorLastName,
      errorEmail: errorEmail,
      errorPassword: errorPassword,
    });
  }

  // console.log(req.body.email);
  // User.findOne({ email: `${req.body.email}` }, (err, user) => {
  //   if (user) {
  //     return res.status(400).json({
  //       error: "Email already exist",
  //     });
  //   }
  // });

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        errorEmail: "Email already exist",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

//signin goes here
exports.signin = (req, res) => {
  const { email, password } = req.body;

  var errorEmail = checkemail(email);
  var errorPassword = signinPassword(password);

  if (errorEmail || errorPassword !== "") {
    return res.status(422).json({
      errorEmail: errorEmail,
      errorPassword: errorPassword,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: `Email does not exist`,
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and Password does not match",
      });
    }
    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to frontend
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: {
        _id,
        name,
        email,
        role,
      },
    });
  });
};
exports.signout = (req, res) => {
  res.clearCookie("token");
  // res.send('user signout success');
  res.json({
    message: "user signout successfully",
  });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//custom middlewares

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id; //req.profile is set in frontend
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You don't have admin rights, ACCESS DENIED",
    });
  }
  next();
};
