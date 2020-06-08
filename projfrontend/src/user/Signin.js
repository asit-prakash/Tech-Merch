import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth/helper";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    errorEmail: "",
    password: "",
    errorPassword: "",
    error: "",
    loading: false,
    didRedirect: false,
  });

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

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

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

  const signInForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light mandatory">Email</label>
              <input
                id="email"
                className="form-control "
                onChange={handleChange("email")}
                placeholder="Enter Email"
                value={email}
                type="email"
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

  const errorMessageEnable = () => {
    if (errorEmail !== "") {
      document.getElementById("email").classList.add("is-invalid");
    }
    if (errorPassword !== "") {
      document.getElementById("password").classList.add("is-invalid");
    }
  };

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

  //TODO:: MAKE IT BETTER
  const loadingMessage = () => {
    return (
      loading && (
        <div className="alert alert-info">
          <h5>Loading...</h5>
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
        <p className="text-white text-center"> {JSON.stringify(values)}</p>
      </Base>
    </div>
  );
};

export default Signin;
