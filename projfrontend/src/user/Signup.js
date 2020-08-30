import React, { useState, useRef } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { signup } from "../auth/helper";

const Signup = () => {
  //state for managing form-elements values
  const [values, setValues] = useState({
    name: "",
    errorFirstName: "",
    lastname: "",
    errorLastName: "",
    email: "",
    errorEmail: "",
    password: "",
    errorPassword: "",
    newUser: "",
    success: "",
  });

  //destructuring of state objects
  const {
    name,
    errorFirstName,
    lastname,
    errorLastName,
    email,
    errorEmail,
    password,
    errorPassword,
    newUser,
    success,
  } = values;

  //handle change in form-elements value
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  //form submit handler
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
            newUser: data.name,
            success: true,
          });
        }
      })
      .catch(console.log("Error in Signup"));
  };

  //References to form-elements to handle class list for error-handling
  const fnameInput = useRef(null);
  const lnameInput = useRef(null);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  //signup form
  const signUpForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label className="text-light mandatory">First Name</label>
                <input
                  className="form-control"
                  onChange={handleChange("name")}
                  type="text"
                  ref={fnameInput}
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
                  className="form-control"
                  onChange={handleChange("lastname")}
                  type="text"
                  ref={lnameInput}
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
                className="form-control "
                onChange={handleChange("email")}
                type="email"
                ref={emailInput}
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
                className="form-control "
                onChange={handleChange("password")}
                type="password"
                ref={passwordInput}
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

  //Message after successfull user signup
  const successMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-success"
            style={{ display: success ? "" : "none" }}
          >
            {newUser} your account has been created successfully please
            <Link className="text-info" to="/signin">
              {" "}
              Login Here
            </Link>
          </div>
        </div>
      </div>
    );
  };
  //manipulating classList of form-elements to show error messages
  const errorMessageEnable = () => {
    if (errorFirstName !== "") {
      fnameInput.current.classList.add("is-invalid");
    }
    if (errorLastName !== "") {
      lnameInput.current.classList.add("is-invalid");
    }
    if (errorEmail !== "") {
      emailInput.current.classList.add("is-invalid");
    }
    if (errorPassword !== "") {
      passwordInput.current.classList.add("is-invalid");
    }
    if (success === true) {
      fnameInput.current.classList.remove("is-invalid");
      lnameInput.current.classList.remove("is-invalid");
      emailInput.current.classList.remove("is-invalid");
      passwordInput.current.classList.remove("is-invalid");
    }
  };

  return (
    <div>
      <Base
        title="Welcome To Tech Merch"
        description="signup to buy amazing tech merchandise"
      >
        {successMessage()}
        {errorMessageEnable()}
        {signUpForm()}
      </Base>
    </div>
  );
};

export default Signup;
