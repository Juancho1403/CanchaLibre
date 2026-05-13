const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/stripe/checkout", paymentController.createStripeCheckout);
router.post("/paypal/order", paymentController.createPayPalOrder);

module.exports = router;
