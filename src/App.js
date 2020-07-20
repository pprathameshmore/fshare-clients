import React, { Component } from "react";
import "./App.css";
import Homepage from "./Components/Homepage/Homepage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Download from "./Components/Download/Download";
import NotFound from "./Components/NotFound/NotFound";

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
          <Route path="*" exact={true} component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}
export default App;
