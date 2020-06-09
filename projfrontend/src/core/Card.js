import React from "react";
import ImageHelper from "./helper/ImageHelper";
import { API } from "../backend";

const Card = ({ product, addtoCart = true, removeFromCart = false }) => {
  const cardTitle = product ? product.name : "Product Name";
  const cardDescription = product ? product.description : "Product Description";
  const cardPrice = product ? product.price : "Product Price";
  const imageurl = product
    ? `${API}/product/photo/${product._id}`
    : `https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500`;

  const showAddtoCart = (addtoCart) => {
    return (
      addtoCart && (
        <div className="col-12">
          <button
            onClick={() => {}}
            className="btn btn-block btn-outline-success mt-2 mb-2"
          >
            Add to Cart
          </button>
        </div>
      )
    );
  };

  const showRemoveFromCart = (removeFromCart) => {
    return (
      removeFromCart && (
        <div className="col-12">
          <button
            onClick={() => {}}
            className="btn btn-block btn-outline-danger mt-2 mb-2"
          >
            Remove from cart
          </button>
        </div>
      )
    );
  };

  return (
    <div className="card text-white bg-dark border border-info ">
      <div className="card-header lead">{cardTitle}</div>
      <div className="card-body">
        <ImageHelper image={imageurl} />
        <p className="lead bg-success font-weight-normal text-wrap">
          {cardDescription}
        </p>
        <p className="btn btn-success rounded  btn-sm px-4">$ {cardPrice}</p>
        <div className="row">
          {showAddtoCart(addtoCart)}
          {showRemoveFromCart(removeFromCart)}
        </div>
      </div>
    </div>
  );
};
export default Card;
