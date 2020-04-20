import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import {App} from './components/main/App';
import {Config} from './config';
import './index.css';

const firebaseApp = require('firebase/app');
require('firebase/auth');
require("firebase/firestore");
firebaseApp.initializeApp(Config);

firebaseApp.auth().setPersistence(firebaseApp.auth.Auth.Persistence.SESSION)
    .then(function () {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
    })
    .catch(function (error: any) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode);
        console.error(errorMessage);
    });

const routerApp = (
    <React.StrictMode>
        <BrowserRouter>
            <App firebase={firebaseApp}/>
        </BrowserRouter>
    </React.StrictMode>
);
ReactDOM.render(routerApp, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
