const express = require("express");
const router = express.Router();

const { getCategoryById,
    createCategory,
    getCategory,
    getAllCategories,
    updateCategory,
    deleteCategory } = require("../controllers/category");

const { isAuthenticated,
    isSignedIn,
    isAdmin } = require("../controllers/auth");

const { getUserById } = require("../controllers/user");

router.param("userId", getUserById);
router.param("categoryId", getCategoryById);



//Create category
router.post("/category/create/:userId",
    isSignedIn, isAuthenticated, isAdmin, createCategory);



//Read Category
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategories);



//Update Category
router.put("/category/:categoryId/:userId",
    isSignedIn, isAuthenticated, isAdmin, updateCategory);



//Delete Category
router.delete("/category/:categoryId/:userId",
    isSignedIn, isAuthenticated, isAdmin, deleteCategory);


module.exports = router;