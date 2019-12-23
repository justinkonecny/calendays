import React, {Component} from 'react';
import '../../css/Group.scss'
import {DbConstants} from "../../data/DbConstants";
import UserProfile from "../../data/UserProfile";

class Group extends Component {
    constructor(props) {
        super(props);

        this.queryUserProfileFromId = this.queryUserProfileFromId.bind(this);

        const networkGroup = this.props.networkGroup;
        this.name = networkGroup.getName();
        this.timestamp = networkGroup.getTimestamp();
        this.memberUids = networkGroup.getMembers();
        this.db = this.props.db;

        this.state = {
            members: []  // (list of UserProfile): list of group members
        };

        for (const uid of this.memberUids) {
            this.queryUserProfileFromId(uid);
        }
    }

    queryUserProfileFromId(uid) {
        const members = this.state.members;
        this.db.collection(DbConstants.USERS)
            .doc(uid)
            .collection(DbConstants.PROFILE).get()
            .then(doc => {
                if (doc.empty) {
                    // TODO: Display error to user
                    console.error('No user profile found!');
                } else {
                    const prof = doc.docs[0].data();
                    members.push(new UserProfile(prof.firstName, prof.lastName, prof.email, prof.uid, null));
                    this.setState({members});
                }
            });
    }

    render() {
        const memberNames = this.state.members.map(userProfile => {
            return userProfile.getFirstName();
        });

        return (
            <div className={'group-container'}>
                <h3>{this.name}</h3>
                <h4>members</h4>
                <p>{memberNames.join(', ')}</p>
            </div>
        );
    }
}

export default Group;
