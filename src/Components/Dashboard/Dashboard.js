import React, { Component } from "react";
import Axios from "axios";
import { API_URL } from "../../Configs/index";
import FileView from "../FileView/FileView";
import Navbar from "../Navbar/Navbar";
import "./Dashboard.css";
import add from "./icons/add.png";
import forest from "./icons/forest.png";
import process from "./icons/process.png";
import folder from "./icons/folder_search.png";
import cloud from "./icons/cloud.png";
import remove from "./icons/delete.png";
import spinner from "./icons/spinner.png";
import spinner_background from "./icons/spinner_background.png";
import error from "./icons/error.png";

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      password: "",
      downloadLimit: "",
      message: "",
      expire: "",
      fileSize: 0,
      isLoading: true,
      selectedFile: null,
      isSelectingFile: false,
      isSelectedFile: false,
      isUploading: false,
      uploadProgress: "",
      isUploadingInBackground: false,
      isUploadingCrashed: false,
      networkError: false,
    };
    this.token = window.localStorage.getItem("token");
    this.headerConfig = {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "content-type": "multipart/form-data",
      },
    };
  }

  componentDidMount() {
    Axios.get(`${API_URL}/api/v1/files`, this.headerConfig)
      .then(({ data }) => {
        this.setState({
          files: data.data,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          networkError: true,
        });
      });
  }

  fileSelecting = () => {
    Axios.get(`${API_URL}/api/v1/files`, this.headerConfig)
      .then(({ data }) => {
        this.setState({
          files: data.data,
          isLoading: false,
          refreshPage: false,
        });
      })
      .catch((error) => {
        this.setState({
          networkError: true,
        });
      });

    this.setState({
      isSelectingFile: true,
    });
  };

  fileSelectHandler = (event) => {
    const addFiles = event.target.files;
    console.log(event.target.files);

    if (addFiles.length) {
      let totalFileSize = 0;
      for (let i = 0; i < addFiles.length; i++) {
        totalFileSize = totalFileSize + addFiles[i].size;
      }
      this.setState({
        fileSize: totalFileSize / 1000000,
        isSelectedFile: true,
      });
    }
    this.setState({
      selectedFile: addFiles,
    });
  };

  expireSelectorHandler = (event) => {
    this.setState({ expire: event.target.value });
  };

  messageHandler = (event) => {
    this.setState({ message: event.target.value });
  };

  downloadLimitHandler = (event) => {
    this.setState({ downloadLimit: parseInt(event.target.value) });
  };

  passwordHandler = (event) => {
    this.setState({ password: event.target.value });
  };

  fileUploadHandler = () => {
    console.log("Uploading");
    const fileData = new FormData();

    if (!this.state.selectedFile) {
      this.setState({
        isSelectingFile: false,
      });
    } else {
      for (let i = 0; i < this.state.selectedFile.length; i++) {
        fileData.append(`upload[${i}]`, this.state.selectedFile[i]);
      }

      if (this.state.expire) {
        fileData.append("expire", this.state.expire);
      }

      if (this.state.downloadLimit) {
        fileData.append("downloadLimit", parseInt(this.state.downloadLimit));
      }

      fileData.append("password", this.state.password);
      fileData.append("message", this.state.message);

      Axios.post(`${API_URL}/api/v1/files`, fileData, {
        headers: this.headerConfig.headers,
        onUploadProgress: (progressEvent) => {
          this.setState({
            isUploading: true,
            uploadProgress: Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            ),
          });
        },
      })
        .then((response) => {
          console.log(response.data);
          this.setState({
            isSelectingFile: false,
            refreshPage: true,
            isUploading: false,
            files: [...this.state.files, response.data.data],
            selectedFile: null,
            isUploadingInBackground: false,
            fileSize: 0,
          });
          console.log("State is now updated");
          console.log(this.state.files);
        })
        .catch((error) => {
          this.setState({
            isUploadingCrashed: true,
            selectedFile: null,
          });
          console.log(error);
        });
    }
  };

  cancelHandler = () => {
    Axios.get(`${API_URL}/api/v1/files`, this.headerConfig).then(({ data }) => {
      this.setState({
        files: data.data,
        selectedFile: null,
        isSelectingFile: false,
        refreshPage: true,
        fileSize: 0,
      });
    });
  };

  hideHandler = () => {
    this.setState({
      isSelectingFile: false,
      isUploadingInBackground: true,
    });
  };

  render(props) {
    const fileSize = this.state.fileSize.toFixed();
    const {
      files,
      isLoading,
      isSelectingFile,
      isUploading,
      isUploadingInBackground,
      isSelectedFile,
      isUploadingCrashed,
      uploadProgress,
      networkError,
    } = this.state;

    return isSelectingFile ? (
      networkError ? (
        <div>
          <img src={error} alt="Network error" />
          <h2>Something went wrong</h2>
        </div>
      ) : (
        <div className="container d-flex justify-content-center">
          <div className="card">
            <div className="card-body upload-file">
              <div className="text-center">
                <img
                  src={cloud}
                  className="img-fluid text-center"
                  alt="cloud"
                />
                <h3>Upload your files here</h3>
                {isUploadingCrashed ? (
                  <div>
                    <img className="img-fluid" src={error} alt="error" />
                    <p>Uploading failed. Check your network connection ☠ </p>
                  </div>
                ) : isUploading ? (
                  <div>
                    <img
                      className="img-fluid"
                      src={spinner}
                      alt="uploading files"
                    />
                    <h2>{uploadProgress} %</h2>
                    {uploadProgress === 100 ? (
                      <div>
                        <h3>Processing...</h3>
                        <h4 onClick={this.hideHandler}>Hide this</h4>
                        <h5>
                          Now you can close this app, we will back to you after
                          processing file on the server.
                        </h5>
                      </div>
                    ) : (
                      <div>
                        <h3>Uploading...</h3>
                        <h4 onClick={this.hideHandler}>Hide this</h4>
                      </div>
                    )}
                  </div>
                ) : (
                  <form>
                    <div>
                      <div className="form-group">
                        <input
                          type="file"
                          multiple
                          required
                          name="upload"
                          className="form-control"
                          onChange={this.fileSelectHandler}
                        />
                      </div>

                      <div className="form-group">
                        <label>File should expire in</label>
                        <select
                          className="form-control"
                          onChange={this.expireSelectorHandler}
                        >
                          <option value="1">1 day</option>
                          <option value="2">2 days</option>
                          <option value="3">3 days</option>
                          <option value="4">4 days</option>
                          <option value="5">5 days</option>
                          <option value="6">6 days</option>
                          <option value="7">7 days</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Enter password</label>
                        <input
                          className="form-control"
                          type="password"
                          placeholder="Choose password (Optional)"
                          onChange={this.passwordHandler}
                        />
                      </div>

                      <div className="form-group">
                        <label>Enter download limit</label>
                        <input
                          className="form-control"
                          type="number"
                          max="100"
                          min="1"
                          placeholder="Download limit (Optional)"
                          onChange={this.downloadLimitHandler}
                        />
                      </div>
                      <div className="form-group">
                        <label>Enter your message</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Message (Optional)"
                          onChange={this.messageHandler}
                        />
                      </div>
                      <p>File size is {fileSize} MB</p>
                      {fileSize > 1500 ? (
                        <div>Please upload up to 1.5 GB only</div>
                      ) : isSelectedFile ? (
                        <img
                          src={add}
                          alt="upload button"
                          onClick={this.fileUploadHandler}
                        />
                      ) : (
                        <div></div>
                      )}
                      <img
                        src={remove}
                        alt="cancel button"
                        onClick={this.cancelHandler}
                      />
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    ) : (
      <div className="container dashboard-container">
        <Navbar />
        <div className="intro-text text-center">
          <h3>Click here to send files up to 1.5 GB</h3>
          {isUploadingInBackground ? (
            <div onClick={this.fileSelecting}>
              <img
                src={spinner_background}
                className="text-center img-fluid"
                alt="Uploading file"
              />
              <p>We are uploading your files on server...</p>
              <p>Click here to check progress</p>
            </div>
          ) : (
            <img
              src={add}
              alt="Upload file here"
              onClick={this.fileSelecting}
            />
          )}
        </div>
        <div className="container">
          <div className="text-center">
            <h3>Your uploaded files</h3>
            <img src={folder} className="text-center img-fluid" alt="folder" />
          </div>
          {isLoading ? (
            <div className="text-center">
              <img className="img-fluid" src={process} alt="Forest" />
              <h2>Hmm! We are downloading your files from server! 🖥</h2>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center">
              <img className="img-fluid" src={forest} alt="Downloading files" />
              <h2>Hmm! We don't have anything to show here! 🙄</h2>
            </div>
          ) : (
            <div className="row">
              {files.map((file) => {
                return <FileView file={file} />;
              })}
            </div>
          )}
        </div>{" "}
      </div>
    );
  }
}

export default Dashboard;
