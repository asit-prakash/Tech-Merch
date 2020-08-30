import React, { useState } from "react";
import ImageHelper from "./helper/ImageHelper";
import { API } from "../backend";
import { Redirect } from "react-router-dom";
import { addItemToCart, removeItemFromCart } from "./helper/cartHelper";

const Card = ({
  product,
  addtoCart = true,
  removeFromCart = false,
  setReload = (val) => val, //(val) => { return val}
  reload = undefined,
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  const cardTitle = product ? product.name : "Product Name";
  const cardDescription = product ? product.description : "Product Description";
  const cardPrice = product ? product.price : "Product Price";
  const imageurl = product
    ? `${API}/${product.photo.path}`
    : `https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500`;

  const addToCart = () => {
    addItemToCart(product, () => {
      // setRedirect(true);
      removeFromCart = true;
      addtoCart = false;
    });
  };

  // const getARedirect = (redirect) => {
  //   if (redirect) {
  //     return <Redirect to="/cart" />;
  //   }
  // };

  const showAddtoCart = (addtoCart) => {
    return (
      addtoCart && (
        <div className="col-12">
          <button
            onClick={addToCart}
            className="btn btn-block btn-outline-info font-weight-bold rounded mt-2 mb-2"
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
            onClick={() => {
              removeItemFromCart(product._id);
              setReload(!reload);
            }}
            className="btn btn-block btn-outline-danger font-weight-bold rounded mt-2 mb-2"
          >
            Remove from Cart
          </button>
        </div>
      )
    );
  };

  return (
    <div className="card text-white bg-dark border border-info">
      <div className="card-header lead border-info">{cardTitle}</div>
      <div className="card-body">
        <ImageHelper image={imageurl} />
        <p className="lead font-weight-normal mt-2">{cardDescription}</p>
        <p className="lead text-success font-weight-bold">₹ {cardPrice}</p>
        <div className="row">
          {addtoCart && showAddtoCart(addtoCart)}
          {removeFromCart && showRemoveFromCart(removeFromCart)}
        </div>
      </div>
    </div>
  );
};
export default Card;
