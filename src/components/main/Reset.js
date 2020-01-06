import React, {Component} from 'react';
import '../../css/main/Reset.scss';
import '../../css/main/Home.scss';
import InputField from "../common/InputField";

class Reset extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.resendVerification = this.resendVerification.bind(this);
        this.resetPassword = this.resetPassword.bind(this);

        this.state = {
            email: '',
            password: ''
        };
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    }

    resendVerification() {
        this.props.firebase.auth().signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
            .then(success => {
                const user = this.props.firebase.auth().currentUser;
                if (user) {
                    user.sendEmailVerification().then(() => {
                        console.log('Successfully sent verification email');
                    }).catch(error => {
                        console.error('Failed to send verification email');
                        console.error(error);
                    })
                }
            }).catch(error => {
            console.error('Failed to send verification email');
            console.error(error);
        });
    }

    resetPassword() {
        if (this.state.email.length > 3) {
            this.props.firebase.auth().sendPasswordResetEmail(this.state.email).then(success => {
                console.log('Successfully sent password reset email');
            }).catch(error => {
                console.error('Failed to send password reset email');
            })
        }
    }

    render() {
        return (
            <div>
                <InputField type={'email'} autocomplete={'email'} name={'email'} placeholder={'email'}
                            value={this.state.email}
                            onChange={this.handleChange}/>
                <InputField type={'password'} autocomplete={'current-password'} name={'password'} placeholder={'password'}
                            value={this.state.password}
                            onChange={this.handleChange}/>
                <button className={'btn-primary'} onClick={this.resetPassword}>reset password</button>
                <button className={'btn-primary'} onClick={this.resendVerification}>resend verification email</button>
            </div>
        );
    }
}

export default Reset;
