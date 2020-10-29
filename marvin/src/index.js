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
import PlaylistScreen from './components/playlist_screen/PlaylistScreen';
import AlbumScreen from './components/AlbumScreen';


const client = new ApolloClient({ uri: 'http://localhost:3000/graphql' });

ReactDOM.render(
  <ApolloProvider client={client}>
      <Router>
          <div>
              <Route exact path="/login" component={LoginScreen} />
              
              <Route exact path="/register" component={RegisterScreen} />
              <Route exact path="/reqreset" component={RequestReset} />
              <Route exact path="/reset" component={ResetPassword} />
              <Route exact path="/playlist" component={PlaylistScreen} />
              <Route exact path="/album" component={AlbumScreen} />   
          </div>
      </Router>
  </ApolloProvider>, 
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
