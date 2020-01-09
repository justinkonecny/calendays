import React, {Component} from 'react';
import '../../css/main/Login.scss';
import {Redirect} from 'react-router';
import {DbConstants} from '../../data/DbConstants';
import InputField from '../common/InputField';
import logo from '../../resources/logo.svg';

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
                        <div className={'intro-logo-container'}>
                            <img className={'intro-logo'} src={logo} alt={'logo'}/>
                        </div>
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
            fname: '',  // The user's first name
            lname: '',  // The user's last name
            username: '',  // TODO: Add field or remove this
            email: '',  // The user's email address
            password: '',  // The user's password
            auth: false,  // Whether or not a user is authenticated
            userVerified: true,
            invalidFirstName: false,
            invalidLastName: false,
            invalidUsername: false,
            invalidEmail: false,
            invalidPassword: false,
            invalidLogin: false,
            emailSent: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.getCurrentForm = this.getCurrentForm.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.validateAllFields = this.validateAllFields.bind(this);
        this.submit = this.submit.bind(this);

        this.textUnverifiedEmail = 'email is not verified';
        this.textBlankField = 'field cannot be blank';
        this.textInvalidEmail = 'enter a valid email';
        this.textInvalidUsername = 'must be unique and at least 4 characters';
        this.textInvalidPassword = 'must be at least 8 characters with uppercase';
        this.textInvalidLogin = 'invalid email/password combination';
    }

    firebaseError(error) {
        console.log('Failed to authenticate user');
        console.error(error.code, error.message);
    }

    handleSubmit(event) {
        this.submit(event.target.id);
    }

    isValidEmail(email) {
        return email.length > 3
            && (/@/.test(email))
            && (email.split('@')[0].length > 2)
            && (email.split('@')[1].length > 2);
    }

    isValidName(name) {
        return name.length > 0;
    }

    isValidUsername(username) {
        return username.length > 3;
    }

    isValidPassword(password) {
        return password.length > 7
            && (/[a-z]/.test(password))
            && (/[A-Z]/.test(password));
    }

    validateAllFields() {
        const invalidFirstName = !this.isValidName(this.state.fname);
        const invalidLastName = !this.isValidName(this.state.lname);
        const invalidUsername = !this.isValidUsername(this.state.username);
        const invalidEmail = !this.isValidEmail(this.state.email);
        const invalidPassword = !this.isValidPassword(this.state.password);

        if (invalidFirstName || invalidLastName || invalidUsername || invalidEmail || invalidPassword) {
            this.setState({
                invalidFirstName,
                invalidLastName,
                invalidUsername,
                invalidEmail,
                invalidPassword
            });
            return false;
        }
        return true;
    }

    submit(id) {
        if (id === 'submit-login') {
            this.props.firebase.auth().signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
                .catch(error => {
                    this.setState({invalidLogin: true});
                    this.firebaseError(error);
                })
                .then((success) => {
                        if (success) {
                            console.log('Successfully authenticated user ' + this.state.email);
                            const user = this.props.firebase.auth().currentUser;
                            if (!user.emailVerified) {
                                console.error('Email is not verified!');
                                this.setState({userVerified: false});
                            } else {
                                this.setState({
                                    auth: true,
                                    email: '',
                                    password: '',
                                    username: '',
                                    userVerified: true
                                });
                            }
                        } else {
                            console.error('Failed to authenticate user');
                            this.setState({invalidLogin: true});
                        }
                    }
                );
        } else {
            if (!this.validateAllFields()) {
                console.error('Invalid sign-up fields!');
                return;
            }

            // TODO: Add Username validation

            this.props.firebase.auth().createUserWithEmailAndPassword(this.state.email.trim(), this.state.password).catch(this.firebaseError).then(docRef => {
                    const user = this.props.firebase.auth().currentUser;
                    this.setState({userVerified: false});

                    if (user) {
                        const userProfile = {
                            uid: user.uid,
                            email: this.state.email.trim(),
                            fname: this.state.fname.trim(),
                            lname: this.state.lname.trim(),
                            username: this.state.username.trim()
                        };

                        // Update the user's display name in Firebase
                        user.updateProfile({
                            displayName: userProfile.fname
                        }).then(result => {
                            console.log('Successfully updated display name');
                            user.sendEmailVerification().then(() => {
                                console.log('Successfully sent verification email');
                                this.setState({emailSent: true});
                            }).catch(error => {
                                console.error('Failed to send verification email', error);
                            })
                        }).catch(error => {
                            console.error('Failed to update display name!');
                        });


                        // Populate the user's profile in the Firestore
                        this.props.firebase.firestore().collection(DbConstants.USERS)
                            .doc(user.uid)
                            .collection(DbConstants.PROFILE)
                            .add(userProfile)
                            .then(docRef => {
                                console.log('Successfully created profile');
                            })
                            .catch(error => {
                                console.error('Failed to create profile');
                            });

                        // this.setState({
                        //     auth: true,
                        //     email: '',
                        //     password: '',
                        //     username: ''
                        // })
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
                    <form>
                        <InputField className={'login-input'} type={'email'} autocomplete={'email'} name={'email'} placeholder={'email'}
                                    value={this.state.email}
                                    isInvalid={!this.state.userVerified}
                                    invalidText={this.textUnverifiedEmail}
                                    onChange={this.handleChange}
                                    onKeyDown={this.handleKeyPress}/>
                        <InputField className={'login-input'} type={'password'} autocomplete={'current-password'} name={'password'} placeholder={'password'}
                                    value={this.state.password}
                                    isInvalid={this.state.invalidLogin}
                                    invalidText={this.textInvalidLogin}
                                    onChange={this.handleChange}
                                    onKeyDown={this.handleKeyPress}/>
                    </form>
                    <div className={'forgot-container'}>
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
                    <form>
                        <InputField className={'login-input'} type={'text'} autocomplete={'given-name'} name={'fname'} placeholder={'first name'}
                                    value={this.state.fname}
                                    isInvalid={this.state.invalidFirstName}
                                    invalidText={this.textBlankField}
                                    onChange={this.handleChange}/>
                        <InputField className={'login-input'} type={'text'} autocomplete={'family-name'} name={'lname'} placeholder={'last name'}
                                    value={this.state.lname}
                                    isInvalid={this.state.invalidLastName}
                                    invalidText={this.textBlankField}
                                    onChange={this.handleChange}/>
                        <InputField className={'login-input'} type={'username'} autocomplete={'username'} name={'username'} placeholder={'username'}
                                    value={this.state.username}
                                    isInvalid={this.state.invalidUsername}
                                    invalidText={this.textInvalidUsername}
                                    onChange={this.handleChange}/>
                        <InputField className={'login-input'} type={'email'} autocomplete={'email'} name={'email'} placeholder={'email'}
                                    value={this.state.email}
                                    isInvalid={this.state.invalidEmail}
                                    invalidText={this.textInvalidEmail}
                                    onChange={this.handleChange}/>
                        <InputField className={'login-input'} type={'password'} autocomplete={'new-password'} name={'password'} placeholder={'password'}
                                    value={this.state.password}
                                    isInvalid={this.state.invalidPassword}
                                    invalidText={this.textInvalidPassword}
                                    onChange={this.handleChange}/>
                    </form>
                    <div className={'login-btn-container'}>
                        <button id={'submit-register'} className={'login-submit'} onClick={this.handleSubmit}>register</button>
                    </div>
                    {this.state.emailSent && <p>A verification email has been sent!</p>}
                </div>
            );
        }
    }

    componentDidMount() {
        this.props.firebase.auth().onAuthStateChanged(user => {
            if (user) {
                if (!user.emailVerified) {
                    console.error('Email is not verified!');
                } else {
                    this.setState({auth: true});
                    console.log('Successfully authenticated user ' + user.email);
                }
            }
        });
    }

    render() {
        if (this.state.auth) {
            return ( // Redirect to home page if user is already authenticated
                <Redirect to={'/home'}/>
            );
        }
        // Adjusts the style of the 'login' and 'sign up' tabs based on currently selected tab
        const loginClass = this.state.isExistingUser ? 'login-button btn-open login-active' : 'login-button btn-open';
        const signUpClass = this.state.isExistingUser ? 'login-button btn-open' : 'login-button btn-open login-active';

        return (
            <div className={'login-main'}>
                <div>
                    <button id={'login'} className={loginClass} onClick={this.handleClick}>login</button>
                    <button id={'sign-up'} className={signUpClass} onClick={this.handleClick}>sign up</button>
                </div>
                <div>
                    {this.getCurrentForm()}
                </div>
            </div>
        );
    }
}

export default Login;
