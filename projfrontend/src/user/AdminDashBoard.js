import React from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import AdminDashNav from "../core/AdminDashNav";

const AdminDashBoard = () => {
  const {
    user: { name, email },
  } = isAuthenticated();

  const accountInfo = () => {
    return (
      <div className="card mb-4">
        <h4 className="card-header bg-dark text-white">Your Account</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <span className="badge badge-success mr-2 ">Name:</span>
            {name}
          </li>
          <li className="list-group-item">
            <span className="badge badge-success mr-2 ">Email:</span>
            {email}
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Base
      title="Admin Dashboard"
      description="Manage all categories,orders and products here"
      className="container-fluid  p-4 mb-3"
    >
      <div className="row">
        <div className="col-3">
          <AdminDashNav />
        </div>
        <div className="col-9">{accountInfo()}</div>
      </div>
    </Base>
  );
};

export default AdminDashBoard;
