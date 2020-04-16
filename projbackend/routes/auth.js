var express = require("express");
var router = express.Router();
const { check } = require("express-validator")
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

//SignUp Route
router.post("/signup", [
    check("name").isLength({ min: 3 }).withMessage('Must Be atleast 3 characters long '),
    check("email").isEmail().withMessage("Email is Required"),
    check("password").isLength({ min: 5 }).withMessage('Must be atleast 5 characters long')
        .matches(/\d/).withMessage('must contain a digit')
], signup);

//Login Route
router.post("/signin", [
    check("email").isEmail().withMessage("Email is Required"),
    check("password").isLength({ min: 5 }).withMessage("Password cannot be empty")
], signin);

//Logout Route
router.get("/signout", signout);


module.exports = router;
