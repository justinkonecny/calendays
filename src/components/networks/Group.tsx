import React, {Component} from 'react';
import '../../css/networks/Group.scss'
import {NetworkGroup} from '../../data/NetworkGroup';

interface GroupProps {
    networkGroup: NetworkGroup;
}

class Group extends Component<GroupProps, {}> {
    render() {
        const memberNames = this.props.networkGroup.getMembers().map((member) => {
            return member.getFirstName();
        });

        return (
            <div className={'group-container'}>
                <div className={'flex my-auto'}>
                    <h3>{this.props.networkGroup.getName()}</h3>
                    <div className={'color'} style={{backgroundColor: this.props.networkGroup.getColorHex()}}/>
                </div>
                <h4>members</h4>
                <p>{memberNames.join(', ')}</p>
            </div>
        );
    }
}

export default Group;
