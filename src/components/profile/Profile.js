import React, {Component} from 'react';
import '../../css/profile/Profile.scss'

class Profile extends Component {

    render() {
        const userProfile = this.props.userProfile;

        return (
            <div className={'profile-container'}>
                <h2>hi {userProfile.getFirstName()}!</h2>

                <h3>full name</h3>
                <h4>{userProfile.getFullName()}</h4>

                <h3>email</h3>
                <h4>{userProfile.getEmail()}</h4>

                <h3>username</h3>
                <h4>{userProfile.getUsername()}</h4>

                <h3>user id</h3>
                <h4>{userProfile.getUid()}</h4>
            </div>
        );
    }
}

export default Profile;
