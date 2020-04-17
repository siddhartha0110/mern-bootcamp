const express = require("express");
const router = express.Router();

const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProducts, getAllCategories } = require("../controllers/product");

//Params Extraction
router.param("userId", getUserById);
router.param("productId", getProductById);

//All Routes
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);
/*As soon as the userID param is noticed by the post route
It fires router.param for userId and gets the id
Then the middleware is run on it
*/

//Grab A Product
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//Delete Product
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct);
//Update Product
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct);

//Listing Product
router.get("/products", getAllProducts);

router.get("/products/categories", getAllCategories);

module.exports = router;