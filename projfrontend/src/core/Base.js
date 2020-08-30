import { Link } from "react-router-dom";
import React from "react";
import Menu from "./Menu";

const Base = ({
  title = "My Title",
  description = "My Description",
  className = "bg-dark text-white p-4",
  children,
}) => {
  return (
    <div>
      <Menu />
      <div className="container-fluid">
        <div className="my-4 bg-dark text-white text-center">
          <h2 className="display-4">{title}</h2>
          <p className="lead">{description}</p>
        </div>
        <div className={className}>{children}</div>
      </div>
      <footer className="footer mt-auto py3">
        <div className="container-fluid text-white text-center py-3">
          <div className="row">
            <div className="col-4">
              <div className="lead">About Us</div>
              <div className="sitename">
                <Link className="lead sitename" to="/">
                  TechMerch.com
                </Link>
              </div>
              <div className="font-italic text-white">
                An amazing Tech Merchandise store
              </div>
            </div>
            <div className="col-4">
              <div className="lead">Let us help you</div>
              <div>Need support? Poke us at</div>
              <div>asit_prksh@hotmail.com</div>
            </div>
            <div className="col-4">
              <div className="lead">Follow us on</div>
              <div>
                <span className="mr-2">
                  <Link className='text-white' to={{pathname :"https://www.facebook.com/asitprksh/" }} target="_blank">
                    <i className="fa fa-facebook-square fa-2x" aria-hidden="true" />
                  </Link>
                </span>
                <span className="mr-2">
                <Link className='text-white' to={{pathname :"https://www.linkedin.com/in/asit-prakash-96a91b13a/" }} target="_blank">
                <i className="fa fa-linkedin-square fa-2x" aria-hidden="true" />
              </Link>
                </span>
                <span className="mr-2">
                <Link className='text-white' to={{pathname :"https://twitter.com/asitprksh" }} target="_blank">
                <i className="fa fa-twitter-square fa-2x" aria-hidden="true" />
              </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid text-center lead bg-dark">
          <span className="text-muted">
            Built with{" "}
            <i className="fa fa-heart text-danger" aria-hidden="true"></i> by{" "}
            <span className="text-white">Asit</span>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Base;
