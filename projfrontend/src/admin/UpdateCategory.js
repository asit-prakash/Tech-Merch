import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import AdminDashNav from "../core/AdminDashNav";
import { getCategory, updateCategory } from "./helper/adminapicall";

const UpdateCategory = ({ match }) => {
  //state to manage create category
  const [category, setCategory] = useState({
    name: "",
    error: "",
    success: false,
    loading: false,
    updatedCategory: "",
  });

  //destructuring of state objects
  const { name, error, success, loading, updatedCategory } = category;

  //extracting userinfor if user is authenticated
  const { user, token } = isAuthenticated();

  //to prepopulate form input with category name
  const preload = (categoryId) => {
    getCategory(categoryId).then((data) => {
      if (data.error) {
        setCategory({ ...category, error: data.error });
      } else {
        setCategory({ ...category, name: data.name });
      }
    });
  };

  //calling preload after render cycle completes
  useEffect(() => {
    preload(match.params.categoryId);
  }, []);

  //handle change in form values
  const handleChange = (event) => {
    setCategory({
      ...category,
      error: "",
      success: false,
      loading: false,
      name: event.target.value,
    });
  };

  //form submit handler
  const onSubmit = (event) => {
    event.preventDefault();
    setCategory({ ...category, error: "", success: false, loading: true });
    //backend request fired
    updateCategory(match.params.categoryId, user._id, token, { name })
      .then((data) => {
        if (data.error) {
          setCategory({
            ...category,
            error: data.error,
            success: false,
            loading: false,
            name: name,
          });
        } else {
          console.log(data)
          setCategory({
            ...category,
            error: "",
            success: true,
            loading: false,
            name: "",
            updatedCategory: data.name,
          });
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
            {updatedCategory} created successfully
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

  //form for creating new category
  const updateCategoryForm = () => {
    return (
      <div className="card mb-4">
        <h4 className="card-header bg-dark text-white">Update Category</h4>
        <form className="container">
          <div className="form-group">
            <input
              type="text"
              className="form-control my-3"
              onChange={handleChange}
              value={name}
              autoFocus
              placeholder="For Ex. Dev Tshirt"
            />
          </div>
          <div className="form-group">
            <button onClick={onSubmit} className="btn btn-outline-info rounded">
              Update Category
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
        description="update the category here"
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
            {updateCategoryForm()}
          </div>
        </div>
      </Base>
    </div>
  );
};

export default UpdateCategory;
