import React, {Component} from 'react';
import {Redirect} from 'react-router';
import '../../css/Home.scss';
import logo from '../../resources/logo.svg';
import home from '../../resources/home.svg';
import notification from '../../resources/notification.svg';
import profile from '../../resources/profile.svg';
import UserProfile from '../../data/UserProfile';
import {MonthNames} from './Constants';
import {DbConstants} from '../../data/DbConstants';
import NetworkGroup from '../../data/NetworkGroup';
import User from "./User";
import Calendar from "../calendar/Calendar";

const HomePages = {
    HOME: 'icon-home',
    USER: 'icon-user'
};

class Home extends Component {
    constructor(props) {
        super(props);

        this.user = this.props.firebase.auth().currentUser;  // The authenticated user; null if none is authenticated
        this.db = this.props.firebase.firestore();  // The Firebase Firestore (used as user database)

        this.state = {
            currentPage: HomePages.HOME,  // The active page selected by the use
            userProfile: null,  // (UserProfile): The current user's profile
            networkGroups: [],  // (List of NetworkGroup): the current user's networks,
            events: null  // (List): the current user's events
        };

        this.queryUserNetworks = this.queryUserNetworks.bind(this);
        this.queryUserProfileFromId = this.queryUserProfileFromId.bind(this);
        this.queryNetworkGroups = this.queryNetworkGroups.bind(this);
        this.queryUserEvents = this.queryUserEvents.bind(this);
        this.queryUserProfile = this.queryUserProfile.bind(this);
        this.onAddUserNetwork = this.onAddUserNetwork.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleNewEvent = this.handleNewEvent.bind(this);

        this.queryUserEvents();
        this.queryUserProfile();
    }

    queryUserEvents() {
        /**
         * Queries the Firestore for the current user's events
         */
        if (this.user == null) {
            return null;  // There is no authenticated user
        } else {
            this.db.collection(DbConstants.USERS)
                .doc(this.user.uid)
                .collection(DbConstants.EVENTS).get()
                .then(doc => {
                    if (doc.empty) {
                        // TODO: Display error to user
                        console.error('No user events found!');
                        this.setState({events: []});
                    } else {
                        const events = [];
                        doc.docs.forEach(docQuery => {
                            events.push(docQuery.data());
                        });
                        this.setState({events});
                    }
                });
        }
    }

    queryUserProfile() {
        /**
         * Queries the Firestore for the current user's information and
         * saves the user's first name, last name, email, and uid.
         */
        if (this.user == null) {
            return null;  // There is no authenticated user
        } else {  // Create the UserProfile from query result
            this.db.collection(DbConstants.USERS)
                .doc(this.user.uid)
                .collection(DbConstants.PROFILE).get()
                .then(doc => {
                    if (doc.empty) {
                        // TODO: Display error to user
                        console.error('No user profile found!');
                    } else {
                        const profile = doc.docs[0].data();
                        this.queryUserNetworks(profile.firstName, profile.lastName, this.user.email, this.user.uid);
                    }
                });
        }
    }

    queryUserNetworks(firstName, lastName, email, uid) {
        /**
         * Queries the Firestore for the current user's networks and saves
         * them to the user's profile as a list of network IDs.
         */
        if (this.user == null) {
            return null;  // There is no authenticated user
        } else {  // Get the user's networks
            this.db.collection(DbConstants.USERS)
                .doc(this.user.uid)
                .collection(DbConstants.NETWORKS).get()
                .then(doc => {
                    if (doc.empty) {
                        // TODO: Display error to user
                        console.error('No user networks found!');
                        const userProfile = new UserProfile(firstName, lastName, email, uid, []);
                        this.setState({userProfile});
                    } else {
                        const networkData = doc.docs[0].data();
                        const networkList = networkData[DbConstants.MEMBER_OF];
                        const userProfile = new UserProfile(firstName, lastName, email, uid, networkList);
                        this.setState({userProfile});
                        this.queryNetworkGroups(networkList);
                    }
                });
        }
    }

    queryNetworkGroups(networkListUid) {
        /**
         * Queries the Firestore for all networks and saves those which the current user is in.
         */
        this.db.collection(DbConstants.NETWORKS).get()
            .then(col => {
                if (col.empty) {
                    // TODO: Display error to user
                    console.error('No networks found!');
                } else {
                    console.log(col.docs.length + ' networks found');
                    for (const doc of col.docs) {
                        if (networkListUid.includes(doc.id)) {
                            const network = doc.data();
                            const networkGroup = new NetworkGroup(this.db, network.name, network.timestamp, network.members);
                            this.queryUserProfileFromId(networkGroup);
                        }
                    }
                }
            });
    }

    queryUserProfileFromId(group) {
        /**
         * Queries the Firestore for user profiles for all users in a given NetworkGroup.
         */
        const networkGroups = this.state.networkGroups;
        networkGroups.push(group);
        this.setState({networkGroups});

        for (const uid of group.getMembers()) {
            this.db.collection(DbConstants.USERS)
                .doc(uid)
                .collection(DbConstants.PROFILE).get()
                .then(doc => {
                    if (doc.empty) {
                        // TODO: Display error to user
                        console.error('No user profile found!');
                    } else {
                        const prof = doc.docs[0].data();
                        const networkUser = new UserProfile(prof.firstName, prof.lastName, prof.email, prof.uid, null);
                        group.addUser(networkUser);
                        this.setState({networkGroups});
                    }
                });
        }
    }

    onAddUserNetwork(network) {
        const networkGroup = new NetworkGroup(this.db, network.name, network.timestamp, network.members);
        this.queryUserProfileFromId(networkGroup);
    }

    handlePageChange(event) {
        const id = event.target.id;
        if (id === HomePages.USER) {
            this.setState({currentPage: HomePages.USER});
        } else if (id === HomePages.HOME) {
            this.setState({currentPage: HomePages.HOME});
        }
    }

    handleNewEvent(event) {
        const events = this.state.events;
        events.push(event);
        this.setState({events});
    }

    render() {
        if (!this.user) {
            return (  // Redirect back to login page if no user is authenticated
                <Redirect to={'/'}/>
            );
        }

        let currentPage = (<h3>Loading...</h3>);
        if (this.state.currentPage === HomePages.HOME) {
            currentPage = (<Calendar userProfile={this.state.userProfile} events={this.state.events} db={this.db} handleNewEvent={this.handleNewEvent}/>);
        } else if (this.state.currentPage === HomePages.USER) {
            currentPage = (<User userProfile={this.state.userProfile} networkGroups={this.state.networkGroups} events={this.state.events} db={this.db} handleNewEvent={this.handleNewEvent}/>);
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
                    <NavBar onClick={this.handlePageChange}/>
                    <div className={'contents'}>
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

        return (
            <div className={'navbar'}>
                <div className={'nav-btn-container'}>
                    <div style={{'marginTop': '20px'}}>
                        <button className={'btn-invisible'} onClick={this.props.onClick}>
                            <img id={'icon-home'} className={'logo'} src={home} alt={'home'}/>
                        </button>
                    </div>
                    <div style={{'marginTop': '20px'}}>
                        <img className={'logo'} src={notification} alt={'notification'}/>
                    </div>
                    <div style={{'marginTop': '20px'}}>
                        <button className={'btn-invisible'} onClick={this.props.onClick}>
                            <img id={'icon-user'} className={'logo'} src={profile} alt={'profile'}/>
                        </button>
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
                                {MonthNames[date.getMonth()].substring(0, 3).toUpperCase()}
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
