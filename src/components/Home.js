import React, {Component} from 'react';
import {Redirect} from 'react-router';
import '../css/Home.css';
import logo from '../resources/logo.svg';
import notification from '../resources/notification.svg';
import profile from '../resources/profile.svg';
import Calendar from './Calendar';

class Home extends Component {
    render() {
        let user = this.props.firebase.auth().currentUser;
        if (!user && false) { // TODO: Temporary auth bypass for development, REMOVE !!
            return (
                <Redirect to={'/'}/>
            );
        }
        return (
            <div>
                <div className={'header'}>
                    <div className={'container-logo'}>
                        <img className={'logo'} src={logo} alt={'logo'}/>
                    </div>
                    <h1 id={'title'}>calendays</h1>
                </div>
                <div className={'page'}>
                    <NavBar/>
                    <div className={'contents'}>
                        <div className={'content-btns'}>
                            <button id={'my-calendar'} className={'btn-home btn-open'} onClick={this.handleClick}>my calendar</button>
                            <button id={'my-networks'} className={'btn-home btn-open'} onClick={this.handleClick}>my networks</button>
                            <button id={'my-profile'} className={'btn-home btn-open'} onClick={this.handleClick}>my profile</button>
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
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        const date = new Date();

        return (
            <div className={'navbar'}>
                <div className={'nav-btn-container'}>
                    <div style={{'margin-top': '20px'}}>
                        <img className={'logo'} src={notification} alt={'notification'}/>
                    </div>
                    <div style={{'margin-top': '20px'}}>
                        <img className={'logo'} src={profile} alt={'profile'}/>
                    </div>
                </div>
                <div className={'nav-today-container'}>

                    <div className={'nav-today-header'}>
                        <div className={'flex-centered'}>
                            today
                        </div>
                    </div>

                    <div className={'nav-date-container'}>
                        <div className={'flex-centered'}>
                            <div className={'nav-month'}>
                                {monthNames[date.getMonth()].substring(0, 3).toUpperCase()}
                            </div>
                            <div className={'nav-day'}>
                                {date.getDate()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
