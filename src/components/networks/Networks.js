import React, {Component} from 'react';
import Group from './Group';
import '../../css/Networks.scss'
import NetworkGroup from "../../data/NetworkGroup";
import {DbConstants} from "../../data/DbConstants";

class Networks extends Component {
    constructor(props) {
        super(props);

        this.queryNetworkGroups = this.queryNetworkGroups.bind(this);
        this.db = this.props.db;

        this.state = {
            loadedGroups: false,
            networkGroups: []
        };
    }

    queryNetworkGroups(networkListUid) {
        const networkGroups = this.state.networkGroups;
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
                            networkGroups.push(networkGroup);
                        }
                    }
                    this.setState({networkGroups, loadedGroups: true});
                }
            });
    }

    render() {
        this.userProfile = this.props.userProfile;
        if (this.userProfile == null) {
            return null;
        } else if (!this.state.loadedGroups) {
            const networkList = this.userProfile.getNetworks();
            this.queryNetworkGroups(networkList)
        }

        const groups = this.state.networkGroups.map(networkGroup => {
           return (<Group db={this.db} networkGroup={networkGroup} key={networkGroup.getName()}/>)
        });

        return (
            <div className={'networks-container'}>
                <h2>networks</h2>
                {groups}
            </div>
        );
    }
}

export default Networks;
