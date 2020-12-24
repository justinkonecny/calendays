import React, {Component} from 'react';
import {Redirect} from 'react-router';
import '../../css/main/Home.scss';
import {UserProfile} from '../../data/UserProfile';
import {NetworkGroup} from '../../data/NetworkGroup';
import {User} from './User';
import {Calendar} from '../calendar/Calendar';
import {NavBar} from './NavBar';
import * as firebase from 'firebase/app';
import {Pages} from "../../data/Pages";
import {Api} from '../../api';
import {NetworkEvent} from '../../data/NetworkEvent';
import {NetworkUser} from '../../data/NetworkUser';
import {AxiosResponse} from 'axios';
import {Notifications} from './Notifications';

interface HomeProps {
    firebase: any;
    page: string;
}

interface HomeState {
    user: firebase.User;
    currentPage: string;
    userProfile: null | UserProfile;
    networkGroups: NetworkGroup[];
    events: null | NetworkEvent[];
    loading: boolean;
    personalNetworkId: number;
    invalidAuth: boolean;
}

export class Home extends Component<HomeProps, HomeState> {

    constructor(props: HomeProps) {
        super(props);

        this.state = {
            user: this.props.firebase.auth().currentUser,
            loading: true,
            currentPage: '',  // The active page selected by the user
            userProfile: null,  // (UserProfile): The current user's profile
            networkGroups: [],  // (List of NetworkGroup): the current user's networks,
            events: null,  // (List): the current user's events
            personalNetworkId: -1,
            invalidAuth: false
        };

        this.processUserProfile = this.processUserProfile.bind(this);
        this.processUserNetworks = this.processUserNetworks.bind(this);
        this.processUserEvents = this.processUserEvents.bind(this);
        this.onAddUserNetwork = this.onAddUserNetwork.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleNewEvent = this.handleNewEvent.bind(this);
        this.loadUserInformation = this.loadUserInformation.bind(this);
    }

    async componentDidMount() {
        setTimeout(() => {
            this.setState({
                user: this.props.firebase.auth().currentUser,
            });
            this.loadUserInformation();
        }, 500);
    }

    async loadUserInformation() {
        if (this.state.user) {

            try {
                await Api.refreshSessionWithId(this.state.user.uid);
            } catch (error) {
                this.setState({invalidAuth: true});
                return;
            }

            this.processUserNetworks(await Api.queryUserNetworks());
            this.processUserEvents(await Api.queryUserEvents());
            this.processUserProfile(await Api.queryUserProfile());
            this.setState({loading: false});
        }
    }

    processUserNetworks(responseNetworks: AxiosResponse) {
        if (responseNetworks.status === 200 && responseNetworks.data) {
            let personalNetworkId = this.state.personalNetworkId;
            const networks = responseNetworks.data.map((n: any) => {
                if (n.Name === 'Personal') {
                    personalNetworkId = n.ID;
                }

                const members = n.Members.map((m: any) => {
                    return new NetworkUser(m.ID, m.FirstName, m.LastName, m.Email, m.Username);
                });
                return new NetworkGroup(n.ID, n.Name, n.OwnerId, n.ColorHex, members);
            });
            console.log("(HCM01) Found", responseNetworks.data.length, "user networks!");
            this.setState({
                networkGroups: networks,
                personalNetworkId
            });
        } else {
            this.setState({networkGroups: []});
            console.error("(HCM02) Error querying user networks:", responseNetworks.status);
        }
    }

    processUserEvents(responseEvents: AxiosResponse) {
        if (responseEvents.status === 200 && responseEvents.data) {
            const events = responseEvents.data.map((e: any) => {
                return new NetworkEvent(e.ID, e.Name, e.StartDate, e.EndDate, e.Location, e.Message, e.NetworkId)
            });
            this.setState({events: events});
            console.log("(HCM03) Found", responseEvents.data.length, "user events!");
        } else {
            this.setState({events: []});
            console.error("(HCM04) Error querying user events:", responseEvents.status);
        }
    }

    processUserProfile(responseUser: AxiosResponse) {
        if (responseUser.status === 200 && responseUser.data) {
            const u = responseUser.data;
            this.setState({
                userProfile: new UserProfile(u.ID, u.FirstName, u.LastName, u.Email, u.Username)
            });
            console.log("(HCM03) Successfully found user profile!");
        } else {
            this.setState({userProfile: null});
            console.error("(HCM04) Error querying user profile:", responseUser.status);
        }
    }

    onAddUserNetwork(networkGroup: NetworkGroup) {
        const networkGroups = [...this.state.networkGroups, networkGroup];
        this.setState({networkGroups});
        console.log(networkGroup);
    }

    handlePageChange(event: React.MouseEvent<HTMLElement>) {
        const id = event.currentTarget.id;

        if (id === Pages.USER) {
            this.setState({currentPage: Pages.USER});
        } else if (id === Pages.HOME) {
            this.setState({currentPage: Pages.HOME});
        } else if (id === Pages.NOTIFICATIONS) {
            this.setState({currentPage: Pages.NOTIFICATIONS});
        }
    }

    handleNewEvent(event: any) {
        const events = this.state.events;
        if (events === null) {
            console.error("(HE01): null events list");
            return;
        }
        events.push(event);
        this.setState({events});
    }

    render() {
        if (this.state.invalidAuth || (!this.state.user && !this.state.loading)) {
            return (  // Redirect back to login page if no user is authenticated
                <Redirect to={'/'}/>
            );
        }

        if (this.state.currentPage && this.state.currentPage !== this.props.page) {
            if (this.state.currentPage === Pages.HOME) {
                return (<Redirect to={'/home'}/>);
            } else if (this.state.currentPage === Pages.USER) {
                return (<Redirect to={'/user'}/>);
            } else if (this.state.currentPage === Pages.NOTIFICATIONS) {
                return (<Redirect to={'/notifications'}/>);
            }
        }

        let currentPage = (<h2 className={'loading'}>Loading...</h2>);

        if (!this.state.loading) {
            if (this.props.page === Pages.HOME) {
                currentPage = (<Calendar userProfile={this.state.userProfile}
                                         events={this.state.events}
                                         handleNewEvent={this.handleNewEvent}
                                         page={Pages.HOME}
                                         networkGroups={this.state.networkGroups}
                                         showSharedEvents={true}
                                         personalNetworkId={this.state.personalNetworkId}/>);
            } else if (this.props.page === Pages.USER) {
                currentPage = (<User userProfile={this.state.userProfile}
                                     firebase={this.props.firebase}
                                     networkGroups={this.state.networkGroups}
                                     events={this.state.events}
                                     handleNewEvent={this.handleNewEvent}
                                     onAddUserNetwork={this.onAddUserNetwork}
                                     personalNetworkId={this.state.personalNetworkId}/>);
            } else if (this.props.page === Pages.NOTIFICATIONS) {
                currentPage = (<Notifications events={this.state.events}
                                              networks={this.state.networkGroups}/>);
            }
        }

        return (
            <>
                <NavBar onClick={this.handlePageChange}/>
                <div className={'page'}>
                    <div className={'contents'}>
                        {currentPage}
                    </div>
                </div>
            </>
        );
    }
}
