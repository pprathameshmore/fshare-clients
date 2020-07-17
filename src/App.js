import React, { Component } from "react";
import "./App.css";
import Homepage from "./Components/Homepage/Homepage";
import Dashboard from "./Components/Dashboard/Dashboard";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Download from "./Components/Download/Download";

export class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route path="/download/:fileId">
            <Download />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}
export default App;
