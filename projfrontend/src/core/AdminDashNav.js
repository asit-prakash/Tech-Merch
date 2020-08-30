import React from "react";
import { isAuthenticated } from "../auth/helper";
import { Link } from "react-router-dom";

const AdminDashNav = () => {
  const {
    user: { name },
  } = isAuthenticated();

  const navigation = () => {
    return (
      <div className="card">
        <h4 className="card-header bg-dark text-white">Hello, {name}</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link to="/admin/create/category" className="nav-link text-info">
              Create Category
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/admin/categories" className="nav-link text-info">
              Manage Categories
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/admin/create/product" className="nav-link text-info">
              Create Product
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/admin/products" className="nav-link text-info">
              Manage Products
            </Link>
          </li>
          <li className="list-group-item">
            <Link to="/admin/orders" className="nav-link text-info">
              Manage Orders
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  return <div>{navigation()}</div>;
};
export default AdminDashNav;
