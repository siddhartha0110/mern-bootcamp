const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require('dotenv').config();

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => console.log("MongoDB connection successful"))
    .catch(err => console.log(err))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})
