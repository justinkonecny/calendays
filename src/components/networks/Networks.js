import React, {Component} from 'react';
import Group from './Group';
import '../../css/Networks.scss'

class Networks extends Component {
    render() {
        const userProfile = this.props.userProfile;
        const networkGroups = this.props.networkGroups;

        if (userProfile == null || networkGroups == null) {
            return null;
        }

        const groups = networkGroups.map(networkGroup => {
            return (<Group networkGroup={networkGroup} key={networkGroup.getName()}/>)
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
