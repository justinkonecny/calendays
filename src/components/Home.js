import React, {Component} from 'react';
import {Redirect} from 'react-router';
import '../css/Home.css';
import Calendar from './Calendar';

class Home extends Component {
    render() {
        let user = this.props.firebase.auth().currentUser;
        if (!user) { // TODO: Temporary auth bypass for development, REMOVE !!
            return (
                <Redirect to={'/'}/>
            );
        }
        return (
            <div>
                <div className={'header'}>
                    <h1 id={'title'}>calendays</h1>
                </div>
                <div className={'page'}>
                    <NavBar/>
                    <div className={'contents'}>
                        <div className={'content-btns'}>
                            <button id='my-calendar' className='btn-home' onClick={this.handleClick}>my calendar</button>
                            <button id='my-networks' className='btn-home' onClick={this.handleClick}>my networks</button>
                            <button id='my-profile' className='btn-home' onClick={this.handleClick}>my profile</button>
                        </div>
                        <Calendar/>
                    </div>
                </div>
            </div>
        );
    }
}

class NavBar extends Component {
    render() {
        return (
            <div className={'navbar'}>
                NAV
            </div>
        );
    }
}

export default Home;
