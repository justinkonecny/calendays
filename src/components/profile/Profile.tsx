import React, {Component} from 'react';
import '../../css/profile/Profile.scss'
import {UserProfile} from '../../data/UserProfile';

interface ProfileProps {
    userProfile: null | UserProfile;
}

export class Profile extends Component<ProfileProps, {}> {
    render() {
        const userProfile = this.props.userProfile;
        if (!userProfile) {
            return;
        }

        return (
            <div className={'profile-container'}>
                <h2>hi {userProfile.getFirstName()}!</h2>

                <h3>full name</h3>
                <h4>{userProfile.getFullName()}</h4>

                <h3>email</h3>
                <h4>{userProfile.getEmail()}</h4>

                <h3>username</h3>
                <h4>{userProfile.getUsername()}</h4>
            </div>
        );
    }
}
