import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import './index.css';

const config = {
    apiKey: "AIzaSyB6qyO-H0iQjx1zZzPodJLr3PB-4GFFhRs",
    authDomain: "calendays-ccfc4.firebaseapp.com",
    databaseURL: "https://calendays-ccfc4.firebaseio.com",
    projectId: "calendays-ccfc4",
    storageBucket: "calendays-ccfc4.appspot.com",
    messagingSenderId: "634670053644"
};

const firebase = require('firebase/app');
require('firebase/auth');
firebase.initializeApp(config);

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
