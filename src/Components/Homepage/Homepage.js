import React, { Component } from "react";
import io from "socket.io-client";
import Dashboard from "../Dashboard/Dashboard";
//import { API_URL } from "../../Configs/index";
import "./Homepage.css";
import GoogleSignInBtn from "./icons/btn_google_signin_light_focus_web.png";
const socket = io("https://fshare-auth.azurewebsites.net");

export class Homepage extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      disabled: "",
    };
    this.popup = null;
  }
  setUser = (user) => {
    this.setState({
      user,
    });
  };

  checkPopup() {
    const check = setInterval(() => {
      const { popup } = this;
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check);
        this.setState({
          disabled: "",
        });
      }
    }, 1000);
  }

  // Launches the popup on the server and passes along the socket id so it
  // can be used to send back user data to the appropriate socket on
  // the connected client.
  openPopup() {
    const width = 600,
      height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const url = `https://fshare-auth.azurewebsites.net/api/v1/auth/google?socketId=${socket.id}`;

    return window.open(
      url,
      "",
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
          scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
          height=${height}, top=${top}, left=${left}`
    );
  }

  // Kicks off the processes of opening the popup on the server and listening
  // to the popup. It also disables the login button so the user can not
  // attempt to login to the provider twice.
  startAuth() {
    if (!this.state.disabled) {
      this.popup = this.openPopup();
      this.checkPopup();
      this.setState({
        disabled: "disabled",
      });
    }
  }

  closeCard() {
    this.setState({
      user: {},
    });
  }

  componentDidMount() {
    socket.on("user", (user) => {
      this.popup.close();
      this.setState({
        user,
      });
      window.localStorage.setItem("username", this.state.user.username);
      window.localStorage.setItem("token", this.state.user.sendToken);
    });
  }

  render(props) {
    const { disabled } = this.state;
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token) {
      return <Dashboard token={token} username={username} />;
    } else {
      return (
        <div className="container home-container">
          <div className="card shadow p-3 mb-5 bg-white rounded auth-card-mobile auth-card-desktop">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="intro-text">
                  <h2 className="display-4">
                    FShare - Made Simple, Secure File Sharing on the Internet.{" "}
                  </h2>{" "}
                  <p>Never let your files stay on the Internet again.</p>{" "}
                </div>{" "}
              </div>{" "}
              <div className="col-lg-6 col-md-6 col-sm-12 text-center">
                <div className="auth-btn-desktop auth-btn-mobile text-center">
                  <p> Sign up and start sharing files! </p>{" "}
                  <img
                    src={GoogleSignInBtn}
                    onClick={this.startAuth.bind(this)}
                    disabled={disabled}
                    alt="Google Sign In"
                  />
                  <p>Sign up with Google</p>
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>
        </div>
      );
    }
  }
}
export default Homepage;
