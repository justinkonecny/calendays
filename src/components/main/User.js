import React, {Component} from 'react';
import '../../css/main/User.scss';
import Calendar from '../calendar/Calendar';
import Profile from '../profile/Profile';
import Networks from '../networks/Networks';

const UserPages = {  // The main tabs that a user can view; the value is the 'id' of the tab <button>
    CALENDAR: 'my-calendar',
    NETWORKS: 'my-networks',
    PROFILE: 'my-profile'
};

class User extends Component {
    constructor(props) {
        super(props);

        this.db = this.props.db;

        this.state = {
            currentTab: UserPages.CALENDAR,  // The active tab selected by the user (this is the starting tab)
        };

        this.setActiveTab = this.setActiveTab.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    setActiveTab(event) {
        /**
         * Called when the user clicks one of the tabs at the top of the page (Calendar, Profile, Networks)
         * and is used to change which page is currently displayed.
         */
        const id = event.target.id;
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
        }).catch(error => {
            console.error('Failed to sign out!');
        })
    }

    render() {
        let currentPage = (<h3>Loading...</h3>);
        if (this.state.currentTab === UserPages.CALENDAR) {
            currentPage = (<Calendar userProfile={this.props.userProfile} events={this.props.events} db={this.db} handleNewEvent={this.props.handleNewEvent}/>);
        } else if (this.state.currentTab === UserPages.NETWORKS) {
            currentPage = (<Networks userProfile={this.props.userProfile} networkGroups={this.props.networkGroups} db={this.db} addNewNetwork={this.onAddUserNetwork}/>);
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
                    <button id={'sign-out'} className={classProfile} onClick={this.signOut}>sign out</button>
                </div>
                <div className={'user-content'}>
                    {currentPage}
                </div>
            </div>
        );
    }
}

export default User;
