import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Welcome from './components/welcome/welcome'
import Totito from './components/totito/totito';
import Reinas from './components/reinas/reinas';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Welcome />
        </Route>
        <Route path="/totito">
          <Totito />
        </Route>
        <Route path="/reinas">
          <Reinas />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
