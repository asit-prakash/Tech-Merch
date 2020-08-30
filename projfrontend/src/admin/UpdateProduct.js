import React, { useState, useEffect, useRef } from "react";
import Base from "../core/Base";
import {
  getCategories,
  getProduct,
  updateProduct,
} from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper";
import AdminDashNav from "../core/AdminDashNav";

const UpdateProduct = ({ match }) => {
  const { user, token } = isAuthenticated();

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categories: [],
    loading: false,
    error: "",
    success: false,
    createdProduct: "",
    formData: "",
  });
  const {
    name,
    description,
    price,
    stock,
    categories,
    loading,
    error,
    success,
    createdProduct,
    formData,
  } = values;

  //creating ref to product category and image
  const chooseCategory = useRef(null);
  const chooseImage = useRef(null);

  const preloadProduct = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        preloadCategories();
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          formData: new FormData(),
        });
        // chooseCategory.current.value = data.category._id;
      }
    });
  };

  const preloadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          categories: data,
          formData: new FormData(),
        });
      }
    });
  };

  useEffect(() => {
    preloadProduct(match.params.productId);
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({
      ...values,
      [name]: value,
      error: "",
      success: false,
      loading: false,
    });
  };
  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true, success: false });
    updateProduct(match.params.productId, user._id, token, formData)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            price: "",
            stock: "",
            loading: false,
            success: true,
            createdProduct: data.name,
          });
          //product category and product image are uncontrolled components here
          //setting them null after successfull form submission using ref
          chooseCategory.current.value = "default";
          chooseImage.current.value = "";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //show loading spinner
  const loadingMessage = () => {
    return (
      loading && (
        <div className="d-flex justify-content-center text-white">
          <div className="spinner-border" role="status">
            <span className="sr-only text-white">Loading...</span>
          </div>
        </div>
      )
    );
  };

  //show success message
  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-12">
          <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }}
          >
            {createdProduct} created successfully
          </div>
        </div>
      </div>
    );
  };

  //show error message
  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-12">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  const updateProductForm = () => {
    return (
      <div className="card mb-4">
        <h4 className="card-header bg-dark text-white">Update Product</h4>
        <form className="container">
          <div className="form-group">
            <label className="text-dark mandatory  my-3">
              All fields are mandatory
            </label>
            <input
              onChange={handleChange("name")}
              className="form-control"
              placeholder="Enter Product Name"
              value={name}
            />
          </div>
          <div className="form-group">
            <textarea
              onChange={handleChange("description")}
              className="form-control"
              placeholder="Enter Product Description"
              value={description}
            />
          </div>
          <div className="form-group">
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">₹</div>
              </div>
              <input
                onChange={handleChange("price")}
                type="number"
                id="inlineFormInputGroup"
                className="form-control"
                placeholder="Enter Product Price"
                value={price}
              />
            </div>
          </div>
          <div className="form-group">
            <select
              onChange={handleChange("category")}
              className="form-control"
              ref={chooseCategory}
            >
              <option value="default">Choose Product Category</option>
              {categories &&
                categories.map((cate, index) => {
                  return (
                    <option key={index} value={cate._id}>
                      {cate.name}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="form-group">
            <input
              onChange={handleChange("stock")}
              type="number"
              className="form-control"
              placeholder="Enter Product Quantity"
              value={stock}
            />
          </div>
          <div className="form-group">
            <label className="text-dark">Choose Product Image </label>
            <input
              onChange={handleChange("photo")}
              type="file"
              accept="image"
              placeholder="choose a file"
              ref={chooseImage}
            />
          </div>
          <div className="form-group">
            <button
              type="submit"
              onClick={onSubmit}
              className="btn btn-outline-info rounded"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div>
      <Base
        title="Admin Dashboard"
        description="update the product here"
        className="container-fluid  p-4 mb-3"
      >
        <div className="row">
          <div className="col-3">
            <AdminDashNav />
          </div>
          <div className="col-9">
            {loadingMessage()}
            {errorMessage()}
            {successMessage()}
            {updateProductForm()}
          </div>
        </div>
      </Base>
    </div>
  );
};

export default UpdateProduct;
