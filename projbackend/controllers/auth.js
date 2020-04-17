const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
const { validationResult } = require("express-validator");

//SignUp Controller
exports.signup = (req, res) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param
    })
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB"
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id
    });
  });
};

//SignIn Controller
exports.signin = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param
    })
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ err: "User does not Exist" })
    }

    //After Email Exists
    if (!user.authenticate(password)) {
      return res.status(401).json({ err: "Incorrect Password" })
    }
    //After password matches
    const token = jwt.sign({ _id: user._id }, process.env.SECRET) //Create Token
    res.cookie("token", token, { expire: new Date() + 9999 }) //Put token in cookie

    //Response to Front-End
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  })
}


//SignOut Controller
exports.signout = (req, res) => {
  res.clearCookie();
  res.json({
    message: "User signout"
  });
};

//Protected Routes
exports.isSignedIn = expressJWT({
  secret: process.env.SECRET,
  userProperty: "auth"
})

//Custom Middlewares
exports.isAuthenticated = (req, res, next) => {
  let checkAuth = req.profile && req.auth && (req.profile._id == req.auth._id)
  if (!checkAuth) {
    return res.status(403).json({ err: "Access Denied" });
  }
  next();
}

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({ err: "Only Admin Access Allowed" });
  }
  next();
}