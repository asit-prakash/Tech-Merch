import React, { useState } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { signup } from "../auth/helper";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    errorFirstName: "",
    lastname: "",
    errorLastName: "",
    email: "",
    errorEmail: "",
    password: "",
    errorPassword: "",
    error: "",
    success: "",
  });

  const {
    name,
    errorFirstName,
    lastname,
    errorLastName,
    email,
    errorEmail,
    password,
    errorPassword,
    error,
    success,
  } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false });
    signup({ name, lastname, email, password })
      .then((data) => {
        if (
          data.error ||
          data.errorFirstName ||
          data.errorLastName ||
          data.errorEmail ||
          data.errorPassword
        ) {
          setValues({
            ...values,
            error: data.error,
            errorFirstName: data.errorFirstName,
            errorLastName: data.errorLastName,
            errorEmail: data.errorEmail,
            errorPassword: data.errorPassword,
            success: false,
          });
        } else {
          setValues({
            ...values,
            name: "",
            errorFirstName: "",
            lastname: "",
            errorLastName: "",
            email: "",
            errorEmail: "",
            password: "",
            errorPassword: "",
            error: "",
            success: true,
          });
        }
      })
      .catch(console.log("Error in Signup"));
  };

  const signUpForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label className="text-light mandatory">First Name</label>
                <input
                  id="fname"
                  className="form-control "
                  onChange={handleChange("name")}
                  type="text"
                  placeholder="Enter Firstname"
                  value={name}
                />
                <div
                  className="invalid-feedback"
                  style={{ display: errorFirstName ? "" : "none" }}
                >
                  {errorFirstName}
                </div>
              </div>
              <div className="form-group col-md-6">
                <label className="text-light">Last Name</label>
                <input
                  id="lname"
                  className="form-control"
                  onChange={handleChange("lastname")}
                  type="text"
                  placeholder="Enter Lastname"
                  value={lastname}
                />
                <div
                  className="invalid-feedback"
                  style={{ display: errorLastName ? "" : "none" }}
                >
                  {errorLastName}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="text-light mandatory">Email</label>
              <input
                id="email"
                className="form-control "
                onChange={handleChange("email")}
                type="email"
                placeholder="Enter Email"
                value={email}
              />
              <div
                className="invalid-feedback"
                style={{ display: errorEmail ? "" : "none" }}
              >
                {errorEmail}
              </div>
              <small id="emailHelp" className="form-text text-muted ">
                <p className="text-white">
                  We'll never share your email with anyone else.
                </p>
              </small>
            </div>
            <div className="form-group">
              <label className="text-light mandatory">Password</label>
              <input
                id="password"
                className="form-control "
                onChange={handleChange("password")}
                type="password"
                placeholder="Enter Password"
                value={password}
              />
              <div
                className="invalid-feedback"
                style={{ display: errorPassword ? "" : "none" }}
              >
                {errorPassword}
              </div>
            </div>
            <button
              onClick={onSubmit}
              type="submit"
              className="btn btn-success btn-block rounded "
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  };

  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }}
          >
            New account created successfully
            <Link to="/signin"> Login Here</Link>
          </div>
        </div>
      </div>
    );
  };

  const errorMessageEnable = () => {
    if (errorFirstName !== "") {
      document.getElementById("fname").classList.add("is-invalid");
    }
    if (errorLastName !== "") {
      document.getElementById("lname").classList.add("is-invalid");
    }
    if (errorEmail !== "") {
      document.getElementById("email").classList.add("is-invalid");
    }
    if (errorPassword !== "") {
      document.getElementById("password").classList.add("is-invalid");
    }
    if (success === true) {
      document.getElementById("fname").classList.remove("is-invalid");
      document.getElementById("lname").classList.remove("is-invalid");
      document.getElementById("email").classList.remove("is-invalid");
      document.getElementById("password").classList.remove("is-invalid");
    }
  };

  return (
    <div>
      <Base
        title="Welcome To Tech Merch"
        description="signup to buy amazing tech merchandise
      "
      >
        {successMessage()}
        {errorMessageEnable()}
        {signUpForm()}
        <p className="text-white text-center"> {JSON.stringify(values)}</p>
      </Base>
    </div>
  );
};

export default Signup;
