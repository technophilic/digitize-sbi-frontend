import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './App';
import Login from './components/Auth/Login/Login';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

ReactDOM.render(<Router>
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route exact path="/login" component={Login}/>
    </Switch>
  </Router>, document.getElementById('root'));
