const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

//Get Product
exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({ err: "Unable to find product" })
            }
            req.product = product;
            next();
        })
}

//Create Product
exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({ err: "Problem Uploading Data" })
        }

        //destructure fields
        const { name, description, price, category, stock } = fields;
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({ err: "All Fields are necessary" });
        }


        let product = new Product(fields);

        //Handle File Here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({ err: "File Size Should Not Exceed 3MB" });
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type;
        }

        //Save Product 
        product.save((err, productSaved) => {
            if (err) {
                return res.status(400).json({ err: "Unable to save Product" })
            }
            res.json(productSaved);
        })
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

//Middleware
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

//Delete
exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.statsu(400).json({ err: "Unable to delete Product" })
        }
        res.json({
            message: `Deletion of product ${deletedProduct.name} successfull`
        })
    })
}

//Update
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({ err: "Problem Uploading Data" })
        }

        //Updation Code using Lodash
        let product = req.product;
        product = _.extend(product, fields)

        //Handle File Here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({ err: "File Size Should Not Exceed 3MB" });
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type;
        }

        //Save Product 
        product.save((err, productSaved) => {
            if (err) {
                return res.status(400).json({ err: "Unable to Update Product" })
            }
            res.json(productSaved);
        })
    })
}

//Get all products
exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    Product.find()
        .select("-photo")
        .populate("category")
        .sort([sortBy, "asc"])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({ err: "No Products Present" })
            }
            res.json(products);
        })
}

exports.getAllCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if (err) {
            res.status(400).json({ err: "Unable to Fetch Categories" })
        }
        res.json(category);
    })
}

//After Order Completions
exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { stock: -prod.count, sold: + item.count } }
            }
        }
    });

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            res.status(400).json({ err: "BulkWrite Failed" })
        }
        next();
    })
}

