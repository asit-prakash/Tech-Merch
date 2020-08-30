import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Base from "../core/Base";
import AdminDashNav from "../core/AdminDashNav";
import { getCategories, deleteCategory } from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper";

const ManageCategories = () => {
  //state to manage categories
  const [categories, setCategories] = useState([]);

  const { user, token } = isAuthenticated();

  //load all categories
  const preload = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  //to run preload after render cycle completes
  useEffect(() => {
    preload();
  }, []);

  //delete a category
  const deleteThisCategory = (categoryId) => {
    deleteCategory(categoryId, user._id, token).then((data) => {
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
      description="manage categories here"
      className="container-fluid p-4 mb-3"
    >
      <div className="row">
        <div className="col-3">
          <AdminDashNav />
        </div>
        <div className="col-9">
          <div className="card mb-4">
            <h4 className="card-header bg-dark text-white mb-1">
              Manage Categories
            </h4>
            <div className="container">
              {categories &&
                categories.map((category, index) => {
                  return (
                    <div key={index} className="card-body bg-dark text-white mb-2">
                      <h5 className="card-title">{category.name}</h5>
                      <Link
                        className="btn btn-info rounded mt-3"
                        to={`/admin/category/update/${category._id}`}
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => {
                          deleteThisCategory(category._id);
                        }}
                        className="btn btn-danger rounded ml-3 mt-3"
                      >
                        Delete
                      </button>
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

export default ManageCategories;
