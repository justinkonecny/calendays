import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import App from './components/main/App';
import './index.css';
import { Config } from './config';

const firebase = require('firebase/app');
require('firebase/auth');
require("firebase/firestore");
firebase.initializeApp(Config);

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
    .then(function() {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(errorCode);
        console.error(errorMessage);
    });

const routerApp = (
    <BrowserRouter>
        <App firebase={firebase} />
    </BrowserRouter>
);
ReactDOM.render(routerApp, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
