const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

//Exporting Routes
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("MongoDB Connection Successfull");
  });

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Using Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

//PORT
const port = process.env.PORT || 5000;

//Starting a server
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
