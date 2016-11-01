import React from 'react';
import {Route, Router, IndexRoute, hashHistory} from 'react-router';

import firebase from 'app/firebase/';

import Main from 'Main';
import Login from 'Login';
import Dashboard from 'Dashboard';
import TripsList from 'TripsList';


var requireLogin = (nextState, replace, next) => {
  if (!firebase.auth().currentUser) {
    replace('/login');
    //console.log('redirect to login');
  }
  next();
};

var redirectIfLoggedIn = (nextState, replace, next) => {
  if (firebase.auth().currentUser) {
    replace('/');
    //console.log('already logged in, redirect to home');
  }
  next();
};

export default (
  <Router history={hashHistory}>
    <Route path="/" component={Main}>
      <IndexRoute component={Dashboard}/>
      <Route path="trips" component={TripsList} />
      <Route path="register" component={Login} />
    </Route>
  </Router>
);
