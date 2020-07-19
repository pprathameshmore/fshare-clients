import React, { Component } from "react";

import logo from "./icons/logo192.png";

export default class Navbar extends Component {
  logOutHandler = () => {
    window.localStorage.clear();
  };

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">
          <img
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt=""
          />
          FShare
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className="nav-item nav-link active btn" href="/">
              Home <span className="sr-only">(current)</span>
            </a>
            <a
              className="nav-item nav-link btn"
              href="/"
              onClick={this.logOutHandler}
            >
              Log out
            </a>
          </div>
        </div>
      </nav>
    );
  }
}
