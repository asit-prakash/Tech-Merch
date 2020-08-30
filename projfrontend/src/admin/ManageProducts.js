import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { getProducts, deleteProduct } from "./helper/adminapicall";
import AdminDashNav from "../core/AdminDashNav";
import { API } from "../backend";

const ManageProducts = () => {
  //state to manage products
  const [products, setproducts] = useState([]);

  const { user, token } = isAuthenticated();

  //load all the products
  const preload = () => {
    getProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setproducts(data);
      }
    });
  };

  //to run preload after render cycle completes
  useEffect(() => {
    preload();
  }, []);

  //delete a product
  const deleteThisProduct = (productId) => {
    deleteProduct(productId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        preload();
      }
    });
  };

  return (
    <Base
      title="Admin Dashboard"
      description="manage products here"
      className="container-fluid p-4 mb-3"
    >
      <div className="row">
        <div className="col-3">
          <AdminDashNav />
        </div>
        <div className="col-9">
          <div className="card mb-4">
            <h4 className="card-header bg-dark text-white mb-1">Manage Products</h4>
            <div className="container">
              {products.map((product, index) => {
                return (
                  <div key={index} className="card text-white bg-dark border  mb-2">
                    <div className="row no-gutters">
                      <div className="col-md-4">
                        <img
                          src={`${API}/${product.photo.path}`}
                          className="card-img"
                          alt={product.name}
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <h5 className="card-title">{product.name}</h5>
                          <p className="card-text">{product.description}</p>
                          <span className="badge badge-success mr-2">
                            Price:
                          </span>
                          <span className="font-weight-bold mr-2">
                            ₹{product.price}
                          </span>
                          <span className="badge badge-info mr-2">Stock:</span>
                          <span className="font-weight-bold mr-2">
                            {product.stock}
                          </span>
                          <span className="badge badge-secondary mr-2">
                            Sold:
                          </span>
                          <span className="font-weight-bold mr-2">
                            {product.sold}
                          </span>
                          <span className="badge badge-light mr-2">
                            Category:
                          </span>
                          <span className="font-weight-bold">
                            {product.category._id}
                          </span>
                          <div>
                            <Link
                              className="btn btn-info rounded mt-3"
                              to={`/admin/product/update/${product._id}`}
                            >
                              Update
                            </Link>
                            <button
                              onClick={() => {
                                deleteThisProduct(product._id);
                              }}
                              className="btn btn-danger rounded ml-3 mt-3"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Base>
  );
};
export default ManageProducts;
