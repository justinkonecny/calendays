import React, {Component} from 'react';
import '../css/Profile.scss'

class Profile extends Component {
    constructor(props) {
        super(props);
        this.userProfile = this.props.userProfile;
    }

    render() {
        return (
            <div className={'profile-container'}>
                <h2>Hi {this.userProfile.getFistName()}!</h2>

                <h3>full name</h3>
                <h4>{this.userProfile.getFullName()}</h4>

                <h3>email</h3>
                <h4>{this.userProfile.getEmail()}</h4>
            </div>
        );
    }
}

export default Profile;
