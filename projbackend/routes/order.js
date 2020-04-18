const express = require("express");
const router = express.Router();

const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user")
const { updateStock } = require("../controllers/product");
const { getOrderById, createOrder, getAllOrders, updateStatus, getOrderStatus } = require("../controllers/order");

//param Extraction
router.get("userId", getUserById);
router.get("orderId", getOrderById);

//Create
router.post("/order/create/:userId",
    isSignedIn,
    isAuthenticated,
    pushOrderInPurchaseList,
    updateStock,
    createOrder);


//Get Orders
router.get("/order/all/:userId",
    isSignedIn, isAuthenticated, isAdmin, getAllOrders);

//Order Status
router.get("/order/status/:userId",
    isSignedIn, isAuthenticated, isAdmin, getOrderStatus)

router.put("/order/:orderId/status/:userId"
    , isSignedIn, isAuthenticated, isAdmin, updateStatus);

module.exports = router;