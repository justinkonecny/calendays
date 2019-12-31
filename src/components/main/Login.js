import React, {Component} from 'react';
import '../../css/main/Login.scss';
import {Redirect} from "react-router";
import {DbConstants} from "../../data/DbConstants";
import InputField from "../common/InputField";

class Login extends Component {
    render() {
        const user = this.props.firebase.auth().currentUser;
        if (user) {
            return (  // Redirect home if currently authenticated
                <Redirect to={'/home'}/>
            );
        }

        return (
            <div className={'Login'}>
                <div className={'container'}>
                    <div className={'info-intro'}>
                        <h1 id={'greeting'}>hey! let's make plans!</h1>
                        <p className={'intro-blurb'}>crazy busy and can’t remember your friends’ schedules? calendays is here to help!</p>
                        <ul className={'intro-blurb bullets'}>
                            <li>easily see when friends are free</li>
                            <li>send invitations and polls</li>
                            <li>connect Google calendar</li>
                            {/* TODO: ADJUST WHAT THIS SAYS */}
                        </ul>
                    </div>
                    <div className={'user-login'}>
                        <h1 id={'calendays'}>calendays</h1>
                        <LoginForm firebase={this.props.firebase}/>
                    </div>
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isExistingUser: true,  // Displays login tab or sign up tab
            firstName: '',  // The user's first name
            lastName: '',  // The user's last name
            username: '',  // TODO: Add field or remove this
            email: '',  // The user's email address
            password: '',  // The user's password
            auth: false  // Whether or not a user is authenticated
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.getCurrentForm = this.getCurrentForm.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.submit = this.submit.bind(this);
    }

    firebaseError(error) {
        console.log('Failed to authenticate user');
        console.error(error.code, error.message);
    }

    handleSubmit(event) {
        this.submit(event.target.id);
    }

    submit(id) {
        if (id === 'submit-login') {
            this.props.firebase.auth().signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
                .catch(this.firebaseError)
                .then(() => {
                        console.log('Successfully authenticated user ' + this.state.email);
                        this.setState({
                            auth: true,
                            email: '',
                            password: '',
                            username: ''
                        });
                    }
                );
        } else {
            this.props.firebase.auth().createUserWithEmailAndPassword(this.state.email.trim(), this.state.password).catch(this.firebaseError).then(docRef => {
                    const user = this.props.firebase.auth().currentUser;
                    if (user) {
                        const userProfile = {
                            uid: user.uid,
                            email: this.state.email.trim(),
                            firstName: this.state.firstName.trim(),
                            lastName: this.state.lastName.trim(),
                            username: this.state.username.trim()
                        };

                        // Populate the users profile
                        this.props.firebase.firestore().collection(DbConstants.USERS)
                            .doc(user.uid)
                            .collection(DbConstants.PROFILE)
                            .add(userProfile)
                            .then(docRef => {
                                console.log('Successfully created profile');
                            })
                            .catch(error => {
                                console.log('Failed to create profile');
                            });

                        this.setState({
                            auth: true,
                            email: '',
                            password: '',
                            username: ''
                        })
                    }
                }
            );
        }
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    }

    handleClick(event) {
        if (event.target.id === 'login') {
            this.setState({isExistingUser: true});
        } else {
            this.setState({isExistingUser: false});
        }
    }

    handleKeyPress(event) {
        if (event.keyCode === 13) {
            // Submit the login form when the 'enter' key is pressed on the input field
            this.submit('submit-login');
        }
    }

    getCurrentForm() {
        if (this.state.isExistingUser) {
            return (
                // The login form; displays fields for email and password
                <div className={'login-form'}>
                    <div>
                        <InputField className={'login-input'} type={'email'} name={'email'} placeholder={'email'} value={this.state.email} onChange={this.handleChange} onKeyDown={this.handleKeyPress}/>
                        <InputField className={'login-input'} type={'password'} name={'password'} placeholder={'password'} value={this.state.password} onChange={this.handleChange} onKeyDown={this.handleKeyPress}/>
                    </div>
                    <div style={{'margin': '10px 0'}}>
                        <a className={'forgot'} href={'/reset'}>forgot password?</a>
                        {/* TODO: make this another page */}
                    </div>
                    <div className={'login-btn-container'}>
                        <button id={'submit-login'} className={'login-submit'} onClick={this.handleSubmit}>login</button>
                    </div>
                </div>
            );
        } else {
            return (
                // The sign up form; displays fields for first name, last name, email and password
                <div className={'login-form'} onSubmit={this.handleSubmit}>
                    <div>
                        <div>
                            <InputField className={'login-input'} type={'text'} name={'firstName'} placeholder={'first name'} value={this.state.firstName} onChange={this.handleChange}/>
                            <InputField className={'login-input'} type={'text'} name={'lastName'} placeholder={'last name'} value={this.state.lastName} onChange={this.handleChange}/>
                            <InputField className={'login-input'} type={'text'} name={'username'} placeholder={'username'} value={this.state.username} onChange={this.handleChange}/>
                        </div>
                        <div>
                            <InputField className={'login-input'} type={'email'} name={'email'} placeholder={'email'} value={this.state.email} onChange={this.handleChange}/>
                            <InputField className={'login-input'} type={'password'} name={'password'} placeholder={'password'} value={this.state.password} onChange={this.handleChange}/>
                        </div>
                    </div>
                    <div className={'login-btn-container'}>
                        <button id={'submit-register'} className={'login-submit'} onClick={this.handleSubmit}>register</button>
                    </div>
                </div>
            );
        }
    }

    render() {
        if (this.state.auth) {
            return ( // Redirect to home page if user is already authenticated
                <Redirect to={'/home'}/>
            );
        }

        // Adjusts the style of the 'login' and 'sign up' tabs based on currently selected tab
        let styleLogin = {color: '#467c95'};
        let styleSignUp = {color: '#f48a84'};

        if (this.state.isExistingUser) {
            styleLogin = {color: '#f48a84'};
            styleSignUp = {color: '#467c95'};
        }

        return (
            <div className={'login-main'}>
                <div>
                    <button id={'login'} className={'login-button btn-open'} style={styleLogin} onClick={this.handleClick}>login</button>
                    <button id={'sign-up'} className={'login-button btn-open'} style={styleSignUp} onClick={this.handleClick}>sign up</button>
                </div>
                <div>
                    {this.getCurrentForm()}
                </div>
            </div>
        );
    }
}

export default Login;
