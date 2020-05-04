import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Game from './Game';
import Auth from './Auth';
import * as serviceWorker from './serviceWorker';

function Application() {
  return (
    <Router>
      <Route exact path='/' component={App}/>
      <Route exact path='/auth' component={Auth}/>
      <Route exact path='/game/:game' component={Game}/>
    </Router>
  );
}
const rootElement = document.getElementById("root");
ReactDOM.render(<Application />, rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
