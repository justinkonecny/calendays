import React, {Component} from 'react';
import {Redirect} from 'react-router';
import '../css/Home.css';
import logo from '../resources/logo.svg';
import notification from '../resources/notification.svg';
import profile from '../resources/profile.svg';
import Calendar from './Calendar';
import Profile from './Profile';
import UserProfile from '../data/UserProfile';
import {MonthNames} from './Constants';
import {DbConstants} from "../data/DbConstants";

const Pages = {  // The main tabs that a user can view; the value is the 'id' of the tab <button>
    CALENDAR: 'my-calendar',
    NETWORKS: 'my-networks',
    PROFILE: 'my-profile'
};

// TODO: Move EVENT list to Home component to prevent unnecessary calls to DB

class Home extends Component {
    constructor(props) {
        super(props);

        this.user = this.props.firebase.auth().currentUser;  // The authenticated user; null if none is authenticated
        this.db = this.props.firebase.firestore();  // The Firebase Firestore (used as user database)

        this.state = {
            currentTab: Pages.PROFILE,  // The active tab selected by the user (this is the starting tab)
            userProfile: null  // The current user's profile
        };

        this.queryUserProfile = this.queryUserProfile.bind(this);
        this.setActiveTab = this.setActiveTab.bind(this);

        this.queryUserProfile();
    }

    queryUserProfile() {
        if (this.user == null) {
            return null;  // There is no authenticated user
        } else {  // Create the UserProfile
            this.db.collection(DbConstants.USERS)
                .doc(this.user.uid)
                .collection(DbConstants.PROFILE).get()
                .then(doc => {
                    if (doc.empty) {
                        // TODO: Display error to user
                        console.error('No user profile found!');
                    } else {
                        const profile = doc.docs[0].data();
                        const userProfile = new UserProfile(profile.firstName, profile.lastName, this.user.email, this.user.uid);
                        this.setState({userProfile});
                    }
                });
        }
    }

    setActiveTab(event) {
        /**
         * Called when the user clicks one of the tabs at the top of the page (Calendar, Profile, Networks)
         * and is used to change which page is currently displayed.
         */
        const id = event.target.id;

        if (id === Pages.CALENDAR) {
            this.setState({currentTab: Pages.CALENDAR});
        } else if (id === Pages.NETWORKS) {
            this.setState({currentTab: Pages.NETWORKS});
        } else if (id === Pages.PROFILE) {
            this.setState({currentTab: Pages.PROFILE});
        }
    }

    render() {
        if (!this.user) {
            return (  // Redirect back to login page if no user is authenticated
                <Redirect to={'/'}/>
            );
        }

        let currentPage = (<h3>Loading...</h3>);
        if (this.state.currentTab === Pages.CALENDAR) {
            currentPage = (<Calendar user={this.user} db={this.db}/>);
        } else if (this.state.currentTab === Pages.NETWORKS) {
            currentPage = (<h4>Networks!</h4>);
        } else if (this.state.currentTab === Pages.PROFILE && this.state.userProfile) {
            currentPage = (<Profile userProfile={this.state.userProfile}/>);
        }

        const classCalendar = (this.state.currentTab === Pages.CALENDAR) ? 'btn-home btn-open btn-active-tab' : 'btn-home btn-open';
        const classNetworks = (this.state.currentTab === Pages.NETWORKS) ? 'btn-home btn-open btn-active-tab' : 'btn-home btn-open';
        const classProfile = (this.state.currentTab === Pages.PROFILE) ? 'btn-home btn-open btn-active-tab' : 'btn-home btn-open';

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
                            <button id={'my-calendar'} className={classCalendar} onClick={this.setActiveTab}>my calendar</button>
                            <button id={'my-networks'} className={classNetworks} onClick={this.setActiveTab}>my networks</button>
                            <button id={'my-profile'} className={classProfile} onClick={this.setActiveTab}>my profile</button>
                        </div>
                        {currentPage}
                    </div>
                </div>
            </div>
        );
    }
}

class NavBar extends Component {
    render() {
        const date = new Date();  // The current date to render at bottom of side nav
        this.monthNames = MonthNames;  // Array containing the months

        return (
            <div className={'navbar'}>
                <div className={'nav-btn-container'}>
                    <div style={{'marginTop': '20px'}}>
                        <img className={'logo'} src={notification} alt={'notification'}/>
                    </div>
                    <div style={{'marginTop': '20px'}}>
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
                                {this.monthNames[date.getMonth()].substring(0, 3).toUpperCase()}
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
