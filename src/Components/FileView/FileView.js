import React, { Component } from "react";
import Axios from "axios";
import moment from "moment";
import { API_URL } from "../../Configs/index";

import "./FileView.css";
import zip from "./icons/zip.png";
import download from "./icons/download.png";
import share from "./icons/share.png";
import lock from "./icons/lock.png";
import deleteFile from "./icons/delete.png";
import error from "./icons/error.png";

export class FileView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: {},
      isFailed: false,
    };
  }

  token = window.localStorage.getItem("token");
  deleteFile = (event) => {
    const headerConfig = {
      headers: { Authorization: `Bearer ${this.token}` },
    };
    const fileId = event.target.id;
    Axios.delete(`${API_URL}/api/v1/files/${fileId}`, headerConfig)
      .then((removedFile) => {
        console.log(removedFile);
        document.getElementById("card" + fileId).remove();
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isFailed: true,
        });
      });
  };

  copyToClipboardLink = (event) => {
    navigator.clipboard.writeText(event.target.id);
  };

  render(props) {
    const {
      id,
      name,
      shortUrl,
      downloads,
      downloadLimit,
      message,
      expire,
      password,
      fileSize,
      createdAt,
    } = this.props.file;
    const { isFailed } = this.state;
    return (
      <div
        className="col-sm-12 col-md-6 col-lg-4 fileview-container"
        id={"card" + id}
        key={"card-key" + id}
      >
        <div className="card mb-5 bg-white rounded">
          <div className="card-body">
            {isFailed ? (
              <div>
                <img className="img-fluid" src={error} alt="failed" />
                <h2>Hmm! We guess that your internet is not working! 🤔</h2>
              </div>
            ) : (
              <div>
                {" "}
                <div className="col">
                  <h5 className="card-title">{name}</h5>
                </div>
                <div className="col">
                  <img src={zip} alt="zip_file" />
                </div>
                <p className="card-text">Message: </p>
                <p
                  className="text-truncate"
                  data-toggle="collapse"
                  data-target={"#message-" + id}
                >
                  {message}
                </p>
                <div id={"message-" + id} class="collapse">
                  {message}
                </div>
                <p className="card-text">Downloads: {downloads}.</p>
                <p className="card-text">Downloads limit: {downloadLimit}.</p>
                <p className="card-text">
                  File size: {(fileSize / 1000000).toFixed()} MB.
                </p>
                <p className="card-text">
                  Short URL: <a href={shortUrl}>{shortUrl} </a>
                </p>
                <p className="card-text">
                  Expire in:{" "}
                  {expire === 1 ? <p> {expire} day</p> : <p> {expire} days </p>}
                </p>
                <div className="row">
                  <a href={`/download/${id}`}>
                    <img src={download} alt="Download file" />
                  </a>
                  <img
                    src={share}
                    alt="Share file"
                    id={shortUrl}
                    onClick={this.copyToClipboardLink}
                  />
                  {password ? (
                    <img
                      src={lock}
                      title="File is secured with password"
                      alt="Locked file"
                    />
                  ) : null}
                  <img
                    id={id}
                    src={deleteFile}
                    title="Delete a file"
                    alt="Delete file"
                    onClick={this.deleteFile}
                  />
                </div>
                <p className="card-text text-muted">
                  {moment().from(createdAt)} ago.
                </p>{" "}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default FileView;
