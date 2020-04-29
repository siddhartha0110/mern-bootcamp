const express = require("express");
const router = express.Router();
const { stripePayment } = require("../controllers/stripepayment");

router.post("/stripe_payments", stripePayment);

module.exports = router;