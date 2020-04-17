const Category = require("../models/category");

//Get Category Params
exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, cate) => {
        if (err) {
            return res.status(400).json({ err: "Unable To Find Category" })
        }
        req.category = cate;
        next();
    })
}


//Create Category
exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if (err) {
            return res.status(400).json({ err: "Unable to create category" })
        }
        res.json({ category });
    })
}



exports.getCategory = (req, res) => {
    return res.json(req.category)
}


//Get All Categories
exports.getAllCategories = (req, res) => {
    Category.find().exec((err, categories) => {
        if (err) {
            return res.status(400).json({ err: "Unable to find categories" })
        }
        res.json(categories);
    })
}



//Update Category
exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updatedCategory) => {
        if (err) {
            return res.status(400).json({ err: "Failed to Update Category" })
        }
        res.json(updatedCategory);
    })
}


//Delete Category
exports.deleteCategory = (req, res) => {
    const category = req.category;
    category.remove((err, category) => {
        if (err) {
            return res.status(400).json({ err: "Deletion Failed" })
        }
        res.json({ message: `Successfully deleted ${category.name}` });
    })
}