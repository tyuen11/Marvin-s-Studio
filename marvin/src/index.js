import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './css/style.css'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';

import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import RequestReset from './components/RequestReset';
import ResetPassword from './components/ResetPassword';
import MainScreen from './components/MainScreen';
import AdminScreen from './components/admin'


const client = new ApolloClient({ uri: 'http://localhost:3000/graphql' });

ReactDOM.render(
  <ApolloProvider client={client}>
      <Router>
          <div>
            <Route path='/admin' component={AdminScreen} />
            <Route path="/login" component={LoginScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path='/app' component={MainScreen} />
          </div>
      </Router>
  </ApolloProvider>, 
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
