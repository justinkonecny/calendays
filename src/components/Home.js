import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/Home.css';

class Home extends Component {
    render() {
        return (
            <div>
                <h1>Home</h1>
                {/*<img src={car} className="App-logo" alt="logo" />*/}
                <Link to="/login" activeClassName="active">
                    <button className="Login-button">
                        Login
                    </button>
                </Link>
            </div>
        );
    }
}

export default Home;
