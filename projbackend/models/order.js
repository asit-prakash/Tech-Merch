const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

var Schema = mongoose.Schema;

const productCartSchema = new Schema({
  product: {
    type: ObjectId,
    ref: "Product",
  },
  name: String,
  count: Number,
  price: Number,
});

const ProductCart = mongoose.model("ProductCart", productCartSchema);

const orderSchema = new Schema(
  {
    products: [productCartSchema],
    transaction_id: {},
    amount: {
      type: Number,
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      default: "Recieved",
      enum: ["Recieved", "Processing", "Shipped", "Cancelled", "Delivered"],
    },
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = {
  Order,
  ProductCart,
};
