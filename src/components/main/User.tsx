import React, {Component} from 'react';
import '../../css/main/User.scss';
import {Calendar} from '../calendar/Calendar';
import Networks from '../networks/Networks';
import * as firebase from 'firebase';
import {UserProfile} from '../../data/UserProfile';
import {NetworkGroup} from '../../data/NetworkGroup';
import {Pages} from "../../data/Pages";
import {NetworkEvent} from '../../data/NetworkEvent';
import {Profile} from '../profile/Profile';

const UserPages = {  // The main tabs that a user can view; the value is the 'id' of the tab <button>
    CALENDAR: 'my-calendar',
    NETWORKS: 'my-networks',
    PROFILE: 'my-profile'
};

interface UserProps {
    firebase: any;
    db: firebase.firestore.Firestore;
    userProfile: null | UserProfile;
    events: null | NetworkEvent[];
    networkGroups: NetworkGroup[];
    handleNewEvent: (event: any) => void;
    onAddUserNetwork: (networkGroup: NetworkGroup) => void;
}

interface UserState {
    currentTab: string;
}

export class User extends Component<UserProps, UserState> {
    constructor(props: UserProps) {
        super(props);

        this.state = {
            currentTab: UserPages.CALENDAR  // The active tab selected by the user (this is the starting tab)
        };

        this.setActiveTab = this.setActiveTab.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    setActiveTab(event: React.MouseEvent<HTMLElement>) {
        /**
         * Called when the user clicks one of the tabs at the top of the page (Calendar, Profile, Networks)
         * and is used to change which page is currently displayed.
         */
        event.preventDefault();
        const id = event.currentTarget.id;
        if (id === UserPages.CALENDAR) {
            this.setState({currentTab: UserPages.CALENDAR});
        } else if (id === UserPages.NETWORKS) {
            this.setState({currentTab: UserPages.NETWORKS});
        } else if (id === UserPages.PROFILE) {
            this.setState({currentTab: UserPages.PROFILE});
        }
    }

    signOut() {
        this.props.firebase.auth().signOut().then(() => {
            console.log('Successfully signed out');
        }).catch((error: any) => {
            console.error('Failed to sign out!');
        })
    }

    render() {
        let currentPage = (<h3>Loading...</h3>);
        if (this.state.currentTab === UserPages.CALENDAR) {
            currentPage = (<Calendar userProfile={this.props.userProfile}
                                     events={this.props.events}
                                     db={this.props.db}
                                     handleNewEvent={this.props.handleNewEvent}
                                     page={Pages.USER}
                                     networkGroups={this.props.networkGroups}/>);
        } else if (this.state.currentTab === UserPages.NETWORKS) {
            currentPage = (<Networks userProfile={this.props.userProfile}
                                     networkGroups={this.props.networkGroups}
                                     db={this.props.db}
                                     addNewNetwork={this.props.onAddUserNetwork}/>);
        } else if (this.state.currentTab === UserPages.PROFILE && this.props.userProfile) {
            currentPage = (<Profile userProfile={this.props.userProfile}/>);
        }

        const classCalendar = (this.state.currentTab === UserPages.CALENDAR) ? 'btn-home btn-open btn-active-tab' : 'btn-home btn-open';
        const classNetworks = (this.state.currentTab === UserPages.NETWORKS) ? 'btn-home btn-open btn-active-tab' : 'btn-home btn-open';
        const classProfile = (this.state.currentTab === UserPages.PROFILE) ? 'btn-home btn-open btn-active-tab' : 'btn-home btn-open';

        return (
            <div className={'user-container'}>
                <div className={'content-btns'}>
                    <button id={'my-calendar'} className={classCalendar} onClick={this.setActiveTab}>my calendar</button>
                    <button id={'my-networks'} className={classNetworks} onClick={this.setActiveTab}>my networks</button>
                    <button id={'my-profile'} className={classProfile} onClick={this.setActiveTab}>my profile</button>
                    <button id={'sign-out'} className={'btn-home btn-open'} onClick={this.signOut}>sign out</button>
                </div>
                <div className={'user-content'}>
                    {currentPage}
                </div>
            </div>
        );
    }
}