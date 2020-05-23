import React, {Component} from 'react';
import '../../css/networks/Group.scss'
import {NetworkGroup} from '../../data/NetworkGroup';

interface GroupProps {
    networkGroup: NetworkGroup;
}

class Group extends Component<GroupProps, {}> {
    render() {
        const networkGroup = this.props.networkGroup;
        const name = networkGroup.getName();
        const users = networkGroup.getMembers();

        const memberNames = users.map((member) => {
            return member.getFirstName();
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
