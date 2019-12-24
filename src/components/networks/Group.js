import React, {Component} from 'react';
import '../../css/Group.scss'

class Group extends Component {
    render() {
        const networkGroup = this.props.networkGroup;
        const name = networkGroup.getName();
        const users = networkGroup.getUsers();

        const memberNames = users.map(userProfile => {
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
