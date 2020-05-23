import React, {Component} from 'react';
import Group from './Group';
import '../../css/networks/Networks.scss'
import {NewNetwork} from './NewNetwork';
import {NetworkGroup} from '../../data/NetworkGroup';
import {UserProfile} from '../../data/UserProfile';
import * as firebase from 'firebase';

interface NetworksProps {
    db: firebase.firestore.Firestore;
    addNewNetwork: (networkGroup: NetworkGroup) => void;
    userProfile: null | UserProfile;
    networkGroups: NetworkGroup[];
}

interface NetworksState {
    showNewNetwork: boolean;
}

class Networks extends Component<NetworksProps, NetworksState> {
    constructor(props: NetworksProps) {
        super(props);

        this.handleNewNetworkSuccess = this.handleNewNetworkSuccess.bind(this);
        this.handleNewNetworkFailure = this.handleNewNetworkFailure.bind(this);
        this.clickShowNewNetwork = this.clickShowNewNetwork.bind(this);

        this.state = {
            showNewNetwork: false
        };
    }

    clickShowNewNetwork() {
        const showing = this.state.showNewNetwork;
        this.setState({showNewNetwork: !showing});
    }

    handleNewNetworkSuccess(networkGroup: NetworkGroup) {
        this.setState({showNewNetwork: false});
        this.props.addNewNetwork(networkGroup);
    }

    handleNewNetworkFailure(error: any) {
        console.error('Error creating new network!');
        console.error(error);
    }

    render() {
        const userProfile = this.props.userProfile;
        const networkGroups = this.props.networkGroups;
        if (userProfile == null || networkGroups == null) {
            return null;
        }

        const groups = networkGroups.map(networkGroup => {
            return (<Group networkGroup={networkGroup} key={networkGroup.getName()}/>);
        });

        return (
            <div className={'networks-container-outer'}>
                {this.state.showNewNetwork && <NewNetwork userProfile={userProfile}
                                                          db={this.props.db}
                                                          handleSuccess={this.handleNewNetworkSuccess}
                                                          handleFailure={this.handleNewNetworkFailure}/>}
                <div className={'network-groups'}>
                    <div className={'networks-header'}>
                        <h2>networks</h2>
                        <button className={'btn-primary btn-new-network'} onClick={this.clickShowNewNetwork}>create new network</button>
                    </div>
                    <div className={'group-list-container'}>
                        {groups}
                    </div>
                </div>
            </div>
        );
    }
}

export default Networks;
