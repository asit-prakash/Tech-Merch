import React, { useState, useRef } from "react";
import Base from "../core/Base";
import { Redirect } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth/helper";

const Signin = () => {
  //state for managing form-elements values
  const [values, setValues] = useState({
    email: "",
    errorEmail: "",
    password: "",
    errorPassword: "",
    error: "",
    loading: false,
    didRedirect: false,
  });

  //destructuring of state objects
  const {
    email,
    errorEmail,
    password,
    errorPassword,
    error,
    loading,
    didRedirect,
  } = values;

  const { user } = isAuthenticated();

  //handle change in form-elements value
  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  //form submit handler
  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password })
      .then((data) => {
        if (data.error || data.errorEmail || data.errorPassword) {
          setValues({
            ...values,
            error: data.error,
            errorEmail: data.errorEmail,
            errorPassword: data.errorPassword,
            loading: false,
            didRedirect: false,
          });
        } else {
          authenticate(data, () => {
            setValues({ ...values, didRedirect: true });
          });
        }
      })
      .catch(console.log("signin failed"));
  };

  //it redirect user after signin
  const performRedirect = () => {
    if (didRedirect) {
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/user/dashboard" />;
      }
    }
    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  //References to form-elements to handle class list for error-handling
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  //signin form
  const signInForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light mandatory">Email</label>
              <input
                className="form-control "
                onChange={handleChange("email")}
                placeholder="Enter Email"
                value={email}
                type="email"
                ref={emailInput}
              />
              <div
                className="invalid-feedback"
                style={{ display: errorEmail ? "" : "none" }}
              >
                {errorEmail}
              </div>
            </div>
            <div className="form-group">
              <label className="text-light mandatory">Password</label>
              <input
                id="password"
                className="form-control"
                onChange={handleChange("password")}
                placeholder="Enter Password"
                value={password}
                type="password"
                ref={passwordInput}
              />
              <div
                className="invalid-feedback"
                style={{ display: errorPassword ? "" : "none" }}
              >
                {errorPassword}
              </div>
            </div>
            <button
              className="btn btn-success btn-block rounded"
              onClick={onSubmit}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  };

  //manipulating classList of form-elements to show error message
  const errorMessageEnable = () => {
    if (errorEmail !== "") {
      emailInput.current.classList.add("is-invalid");
    }
    if (errorPassword !== "") {
      passwordInput.current.classList.add("is-invalid");
    }
  };

  //show signin error
  const signinError = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
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

  //show loading spinner
  const loadingMessage = () => {
    return (
      loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only text-white">Loading...</span>
          </div>
        </div>
      )
    );
  };

  return (
    <div>
      <Base title="Sign in to TechMerch" description="">
        {loadingMessage()}
        {errorMessageEnable()}
        {signinError()}
        {signInForm()}
        {performRedirect()}
      </Base>
    </div>
  );
};

export default Signin;
