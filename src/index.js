import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Game from './Game';
import Auth from './Auth';
import * as serviceWorker from './serviceWorker';
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';

const trackingId = "UA-165630956-1";
ReactGA.initialize(trackingId);

const history = createBrowserHistory();

// Initialize google analytics page view tracking
history.listen(location => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

function Application() {
  return (
    <Router history={history}>
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
