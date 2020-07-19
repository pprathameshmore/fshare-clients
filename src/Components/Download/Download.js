import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import download from "downloadjs";
import moment from "moment";
import "./Download.css";

import { API_URL } from "../../Configs/index";

export class Download extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: {},
      givenPassword: "",
      isPasswordWrong: false,
      isFileAvailable: false,
      downloadProcessing: false,
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
    Axios.post(
      `${API_URL}/api/v1/downloads/${this.fileId}`,
      {
        password: this.state.givenPassword,
      },
      {
        responseType: "arraybuffer",
      }
    )
      .then((data) => {
        console.log(data.headers);
        console.log(data.status);
        download(data.data, this.state.file.name, "application/zip");
        this.setState({
          isPasswordWrong: false,
          downloadProcessing: true,
        });
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

    const { isPasswordWrong, isFileAvailable, downloadProcessing } = this.state;
    return (
      <div className="container downloader-container">
        <h2>File shared using FShare</h2>
        {isFileAvailable ? (
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{name}</h5>
              <h6 class="card-subtitle mb-2 text-muted">
                {moment().from(createdAt)} ago
              </h6>
              <p class="card-text">Message: {message}</p>
              <p class="card-text">
                File Size: {(fileSize / 1000000).toFixed()} MB
              </p>
              <p class="card-text">
                Short URL: <a href={shortUrl}> {shortUrl}</a>{" "}
              </p>
              <p class="card-text">Downloads: {downloads}</p>
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
              {downloadProcessing ? (
                <p>Preparing your download. Please wait...</p>
              ) : (
                <button className="btn btn-success" onClick={this.downloadFile}>
                  Download File
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h2>Hmm! File not available ☹</h2>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Download);
