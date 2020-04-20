import React, {Component} from 'react';
import '../../css/main/Reset.scss';
import '../../css/main/Home.scss';
import InputField from "../common/InputField";

interface ResetProps {
    firebase: any;
}

interface ResetState {
    email: string;
    password: string;
}

export class Reset extends Component<ResetProps, ResetState> {
    constructor(props: ResetProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.resendVerification = this.resendVerification.bind(this);
        this.resetPassword = this.resetPassword.bind(this);

        this.state = {
            email: '',
            password: ''
        };
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const name: string = event.currentTarget.name;
        const value: string = event.currentTarget.value;
        this.setState((prevState: ResetState) => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    resendVerification() {
        this.props.firebase.auth().signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
            .then((success: any) => {
                const user = this.props.firebase.auth().currentUser;
                if (user) {
                    user.sendEmailVerification().then(() => {
                        console.log('Successfully sent verification email');
                    }).catch((error: any) => {
                        console.error('Failed to send verification email');
                        console.error(error);
                    })
                }
            }).catch((error: any) => {
            console.error('Failed to send verification email');
            console.error(error);
        });
    }

    resetPassword() {
        if (this.state.email.length > 3) {
            this.props.firebase.auth().sendPasswordResetEmail(this.state.email)
                .then((success: any) => {
                    console.log('Successfully sent password reset email');
                }).catch((error: any) => {
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
                <br/>
                <InputField type={'password'} autocomplete={'current-password'} name={'password'} placeholder={'password'}
                            value={this.state.password}
                            onChange={this.handleChange}/>
                <br/>
                <button className={'btn-primary'} onClick={this.resetPassword}>reset password</button>
                <br/>
                <br/>
                <button className={'btn-primary'} onClick={this.resendVerification}>resend verification email</button>
            </div>
        );
    }
}
