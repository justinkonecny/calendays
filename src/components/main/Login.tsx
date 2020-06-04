import React, {Component} from 'react';
import {Redirect} from 'react-router';
import {DbConstants} from '../../data/DbConstants';
import InputField from '../common/InputField';
import logo from '../../resources/logo.svg';
import '../../css/main/Login.scss';
import {Api} from '../../api';

interface LoginProps {
    firebase: any;
}

export class Login extends Component<LoginProps, {}> {
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

interface LoginFormProps {
    firebase: any;
}

interface LoginFormState {
    isExistingUser: boolean;
    fname: string;
    lname: string;
    username: string;
    email: string;
    password: string;
    auth: boolean;
    userVerified: boolean;
    invalidFirstName: boolean;
    invalidLastName: boolean;
    invalidUsername: boolean;
    invalidEmail: boolean;
    invalidPassword: boolean;
    invalidLogin: boolean;
    emailSent: boolean;
    duplicateUsername: boolean;
    duplicateEmail: boolean;
}

class LoginForm extends Component<LoginFormProps, LoginFormState> {
    private textUnverifiedEmail: string = 'email is not verified';
    private textBlankField: string = 'field cannot be blank';
    private textInvalidEmail: string = 'enter a valid email';
    private textInvalidUsername: string = 'must be unique and at least 4 characters';
    private textInvalidPassword: string = 'must be at least 8 characters with uppercase';
    private textInvalidLogin: string = 'invalid email/password combination';
    private textDuplicateUsername: string = 'username already in use';
    private textDuplicateEmail: string = 'email already in use';

    constructor(props: LoginFormProps) {
        super(props);
        this.state = {
            isExistingUser: true,  // Displays login tab or sign up tab
            fname: '',  // The user's first name
            lname: '',  // The user's last name
            username: '',  // The user's username
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
            emailSent: false,
            duplicateUsername: false,
            duplicateEmail: false
        };

        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.getCurrentForm = this.getCurrentForm.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.validateAllFields = this.validateAllFields.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.createUser = this.createUser.bind(this);
    }

    componentDidMount() {
        this.props.firebase.auth().onAuthStateChanged((user: any) => {
            if (user) {
                if (!user.emailVerified) {
                    console.error('(ME01) User email is not verified');
                } else if (!this.state.auth) {
                    console.log('(MS01) Successfully authenticated user ' + user.email);
                    this.setState({auth: true});
                }
            }
        });
    }

    isValidEmail(email: string): boolean {
        return email.length > 3
            && (/@/.test(email))
            && (email.split('@')[0].length > 2)
            && (email.split('@')[1].length > 2);
    }

    isValidName(name: string): boolean {
        return name.length > 0;
    }

    isValidUsername(username: string): boolean {
        return username.length > 4;
    }

    isValidPassword(password: string): boolean {
        return password.length > 7
            && (/[a-z]/.test(password))
            && (/[A-Z]/.test(password));
    }

    validateAllFields(): boolean {
        const invalidFirstName = !this.isValidName(this.state.fname);
        const invalidLastName = !this.isValidName(this.state.lname);
        const invalidUsername = !this.isValidUsername(this.state.username);
        const invalidEmail = !this.isValidEmail(this.state.email);
        const invalidPassword = !this.isValidPassword(this.state.password);

        this.setState({
            invalidFirstName,
            invalidLastName,
            invalidUsername,
            invalidEmail,
            invalidPassword
        });

        return !(invalidFirstName || invalidLastName || invalidUsername || invalidEmail || invalidPassword);
    }

    async loginUser() {
        try {
            const userCredential = await this.props.firebase.auth().signInWithEmailAndPassword(this.state.email.trim(), this.state.password);
            const user = userCredential.user;
            console.log('(LS01) Successfully authenticated in user ' + user.email);
            if (!user.emailVerified) {
                console.error('(LE01) User email is not verified');
                this.setState({userVerified: false});
            } else {
                Api.setFirebaseId(user.uid);
                Api.refreshSession();

                this.setState({
                    userVerified: true,
                    auth: true,
                    password: ''
                });
            }
        } catch (error) {
            console.error('(LE02) Failed to authenticate user');
            console.error(error.message);
            this.setState({invalidLogin: true});
        }
    }

    async createUser() {
        if (!this.validateAllFields()) {
            console.error('(SUE01) Invalid sign-up fields');
            return;
        }

        try {
            const username = this.state.username.trim();
            const email = this.state.email.trim();

            const usernameResponse = await Api.checkUserStatus(username, email);
            const existingUsername = usernameResponse.data.ExistingUsername;
            const existingEmail = usernameResponse.data.ExistingEmail;

            if (existingUsername || existingEmail) {
                this.setState({
                    duplicateUsername: existingUsername,
                    duplicateEmail: existingEmail
                });
                return;
            } else if (this.state.duplicateUsername) {
                this.setState({
                    duplicateUsername: false,
                    duplicateEmail: false
                });
            }


            const userCredential = await this.props.firebase.auth().createUserWithEmailAndPassword(this.state.email.trim(), this.state.password);
            this.setState({userVerified: false});
            const user = userCredential.user;
            if (!user) {
                console.error('(SUE05) Something went wrong creating new user');
                return;
            }

            const userProfile = {
                FirstName: this.state.fname.trim(),
                LastName: this.state.lname.trim(),
                Email: email,
                Username: username,
                FirebaseUUID: user.uid
            };

            // Update the user's display name in Firebase
            user.updateProfile({
                displayName: userProfile.FirstName
            }).then(() => {
                console.log('(SUS01) Successfully updated display name');
                return user.sendEmailVerification();
            }).then(() => {
                console.log('(SUS02) Successfully sent verification email');
                this.setState({emailSent: true});
            }).catch((error: any) => {
                console.error('(SUE02) Failed to update display name and send verification email');
                console.error(error);
            });

            // Populate the user's profile in the Firestore
            const response = await Api.createUser(userProfile);
            if (response.status === 201) {
                console.log('(SUE03) Successfully created new user:', userProfile.Username);
            } else {
                console.error('(SUS04) Non-201 response when creating new user');
            }
        } catch (error) {
            console.error('(SUE04) Error occurred when creating new user');
            console.error(error);
        }
    }

    async handleSubmitClick(event: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLElement>) {
        // TODO:??
        event.preventDefault();
        if (event.currentTarget.id === 'submit-login') {
            await this.loginUser();
        } else {
            await this.createUser();
        }
    }

    handleChange(event: React.MouseEvent<HTMLInputElement>) {
        const name: string = event.currentTarget.name;
        const value: string = event.currentTarget.value;
        this.setState((prevState: LoginFormState) => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const name: string = event.currentTarget.name;
        const value: string = event.currentTarget.value;
        this.setState((prevState: LoginFormState) => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (event.currentTarget.id === 'login') {
            this.setState({isExistingUser: true});
        } else {
            this.setState({isExistingUser: false});
        }
    }

    async handleKeyPress(event: React.KeyboardEvent) {
        if (event.keyCode === 13) {
            // Submit the login form when the 'enter' key is pressed on the input field
            await this.loginUser();
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
                                    onChange={this.handleInputChange}
                                    onKeyDown={this.handleKeyPress}/>
                        <InputField className={'login-input'} type={'password'} autocomplete={'current-password'} name={'password'} placeholder={'password'}
                                    value={this.state.password}
                                    isInvalid={this.state.invalidLogin}
                                    invalidText={this.textInvalidLogin}
                                    onChange={this.handleInputChange}
                                    onKeyDown={this.handleKeyPress}/>
                    </form>
                    <div className={'forgot-container'}>
                        <a className={'forgot'} href={'/reset'}>forgot password?</a>
                        {/* TODO: make this another page */}
                    </div>
                    <div className={'login-btn-container'}>
                        <button id={'submit-login'} className={'login-submit'} onClick={this.handleSubmitClick}>login</button>
                    </div>
                </div>
            );
        } else {
            return (
                // The sign up form; displays fields for first name, last name, email and password
                <div className={'login-form'} onSubmit={this.handleSubmitClick}>
                    <form>
                        <InputField className={'login-input'} type={'text'} autocomplete={'given-name'} name={'fname'} placeholder={'first name'}
                                    value={this.state.fname}
                                    isInvalid={this.state.invalidFirstName}
                                    invalidText={this.textBlankField}
                                    onChange={this.handleInputChange}/>
                        <InputField className={'login-input'} type={'text'} autocomplete={'family-name'} name={'lname'} placeholder={'last name'}
                                    value={this.state.lname}
                                    isInvalid={this.state.invalidLastName}
                                    invalidText={this.textBlankField}
                                    onChange={this.handleInputChange}/>
                        <InputField className={'login-input'} type={'username'} autocomplete={'username'} name={'username'} placeholder={'username'}
                                    value={this.state.username}
                                    isInvalid={this.state.invalidUsername || this.state.duplicateUsername}
                                    invalidText={this.state.invalidUsername ? this.textInvalidUsername : this.textDuplicateUsername}
                                    onChange={this.handleInputChange}/>
                        <InputField className={'login-input'} type={'email'} autocomplete={'email'} name={'email'} placeholder={'email'}
                                    value={this.state.email}
                                    isInvalid={this.state.invalidEmail || this.state.duplicateEmail}
                                    invalidText={this.state.invalidEmail ? this.textInvalidEmail : this.textDuplicateEmail}
                                    onChange={this.handleInputChange}/>
                        <InputField className={'login-input'} type={'password'} autocomplete={'new-password'} name={'password'} placeholder={'password'}
                                    value={this.state.password}
                                    isInvalid={this.state.invalidPassword}
                                    invalidText={this.textInvalidPassword}
                                    onChange={this.handleInputChange}/>
                    </form>
                    <div className={'login-btn-container'}>
                        <button id={'submit-register'} className={'login-submit'} onClick={this.handleSubmitClick}>register</button>
                    </div>
                    {this.state.emailSent && <p className={'verification'}>A verification email has been sent!</p>}
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
