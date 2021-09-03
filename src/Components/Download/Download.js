import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import moment from "moment";
import fileDownload from "js-file-download";
import zipIcon from "../FileView/icons/zip.png";
import "./Download.css";

import { API_URL } from "../../Configs/index";
import Footer from "../Footer/Footer";

export class Download extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: {},
      givenPassword: "",
      isPasswordWrong: false,
      isFileAvailable: false,
      isFile: false,
      downloadProcessing: false,
      downloading: false,
    };

    this.fileId = props.match.params.fileId;
  }

  componentDidMount() {
    //Preview the download file details to user
    Axios.get(`${API_URL}/api/v1/downloads/${this.fileId}/preview`)
      .then(({ data }) => {
        this.setState({
          file: data.data,
          isFileAvailable: true,
          isFile: true,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isFileAvailable: false,
        });
      });
  }

  passwordHandler = (event) => {
    console.log(this.state.password);
    this.setState({
      givenPassword: event.target.value,
    });
  };

  downloadFile = () => {
    this.setState({
      downloadProcessing: true,
    });
    Axios.post(
      `${API_URL}/api/v1/downloads/${this.fileId}`,
      {
        password: this.state.givenPassword,
      },

      { responseType: "arraybuffer" }
    )
      .then((data) => {
        this.setState({
          isPasswordWrong: false,
          downloading: true,
        });
        fileDownload(data.data, this.state.file.name);
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isPasswordWrong: true,
        });
      });
  };

  render() {
    const {
      name,
      message,
      shortUrl,
      downloads,
      password,
      createdAt,
      fileSize,
    } = this.state.file;

    const {
      isPasswordWrong,
      isFileAvailable,
      downloadProcessing,
      downloading,
    } = this.state;
    const online = navigator.onLine;

    if (online) {
      return (
        <div className="container downloader-container animate__fadeIn animate__animated">
          <h2>File shared using FShare</h2>
          {isFileAvailable ? (
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <img src={zipIcon} alt="zip icon" />

                    <h5 className="card-title">{name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {moment().from(createdAt)} ago
                    </h6>
                    <p className="card-text">Message: {message}</p>
                    <p className="card-text">
                      File Size: {(fileSize / 1000000).toFixed()} MB
                    </p>
                    <p className="card-text">
                      Short URL: <a href={shortUrl}> {shortUrl}</a>{" "}
                    </p>
                    <p className="card-text">Downloads: {downloads}</p>
                    {password ? (
                      <div>
                        <input
                          type="password"
                          placeholder="Enter file password"
                          onChange={this.passwordHandler}
                        />
                        {isPasswordWrong ? (
                          <div>You entered wrong password</div>
                        ) : null}
                      </div>
                    ) : null}
                    <br></br>
                    {downloadProcessing && !isPasswordWrong ? (
                      downloading ? (
                        <p className="animate__animated animate__flash">
                          Downloading...
                        </p>
                      ) : (
                        <p className="animate__animated animate__flash">
                          Preparing your download. Please wait...
                        </p>
                      )
                    ) : (
                      <button
                        className="btn btn-success animate__animated animate__pulse"
                        onClick={this.downloadFile}
                      >
                        Download File
                      </button>
                    )}
                  </div>
                  <div className="col text-center">
                    {/* <QRCodeGenerate url={shortUrl} /> */}
                  </div>
                </div>
              </div>
              <div className="container">
                <a href="https://fshare.netlify.app/">Sign up</a> for free and
                start sharing!
              </div>
              <Footer />
            </div>
          ) : (
            <div>
              <h2>File not found</h2>
            </div>
          )}
        </div>
      );
    } else {
      return <h1 className="text-center">No internet</h1>;
    }
  }
}

export default withRouter(Download);
