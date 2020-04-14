const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    }
}, { timestamps: true })
//Timestamps record every time a new record is created

module.exports = mongoose.model("Category", categorySchema);