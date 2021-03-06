require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentBRoutes = require("./routes/paymentBRoutes");

//DB connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true, //it parse the  connection url
    useUnifiedTopology: true, //it keep connection alive
    useCreateIndex: true, //it turn on indexing in db
  })
  .then(() => {
    console.log(`DB CONNECTED`);
  })
  .catch(() => {
    console.log("DB GOT OOPPSS");
  });

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Actual Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
//make uploads folder public to access images
app.use("/api/uploads", express.static("uploads"));
app.use("/api", orderRoutes);
app.use("/api", paymentBRoutes);

//Listening PORT
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, () => {
  console.log(`app is runing at ${port}`);
});
