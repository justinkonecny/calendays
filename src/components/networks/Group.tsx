import React, {Component} from 'react';
import '../../css/networks/Group.scss'
import {NetworkGroup} from '../../data/NetworkGroup';
import {UserProfile} from '../../data/UserProfile';

interface GroupProps {
    networkGroup: NetworkGroup;
}

class Group extends Component<GroupProps, {}> {
    render() {
        const networkGroup = this.props.networkGroup;
        const name = networkGroup.getName();
        const users = networkGroup.getUsers();

        const memberNames = users.map((userProfile: UserProfile) => {
            return userProfile.getFirstName();
        });

        return (
            <div className={'group-container'}>
                <h3>{name}</h3>
                <h4>members</h4>
                <p>{memberNames.join(', ')}</p>
            </div>
        );
    }
}

export default Group;
