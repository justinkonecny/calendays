import React, {Component} from 'react';
import {Redirect} from 'react-router';
import InputField from '../common/InputField';
import '../../css/main/Login.scss';
import {Api} from '../../api';
import {Pages} from '../../data/Pages';

interface LoginProps {
    firebase: any;
    page: string;
}

export class Login extends Component<LoginProps, {}> {
    render() {
        const user = this.props.firebase.auth().currentUser;
        if (user) {
            return (  // Redirect home if currently authenticated
                <Redirect to={'/home'}/>
            );
        }

        const minHeight = (this.props.page === Pages.LOGIN) ? '520px' : '670px';

        return (
            <div className={'login-container'}>
                <div className={'user-login'} style={{minHeight}}>
                    <h1 id={'calendays'}>calendays</h1>
                    <p className={'description'}>a calendar tool for groups of friends</p>
                    {this.props.page === Pages.SIGN_UP && <p className={'description-register'}>We'd like to get to know you. Fill out the fields below to get started.</p>}
                    <LoginForm firebase={this.props.firebase} page={this.props.page}/>
                </div>
            </div>
        );
    }
}

interface LoginFormProps {
    firebase: any;
    page: string;
}

interface LoginFormState {
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
                await Api.refreshSessionWithId(user.uid);

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
        event.preventDefault();
        if (this.props.page === Pages.LOGIN) {
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

    async handleKeyPress(event: React.KeyboardEvent) {
        if (event.keyCode === 13) {
            // Submit the login form when the 'enter' key is pressed on the input field
            await this.loginUser();
        }
    }

    getCurrentForm() {
        if (this.props.page === Pages.LOGIN) {
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
                    <a className={'forgot'} href={'/reset'}>forgot password?</a>
                    <div className={'login-btn-container'}>
                        <button id={'submit-login'} className={'btn-primary login-submit'} onClick={this.handleSubmitClick}>login</button>
                    </div>
                    <div className={'register-link-container'}>
                        <p className={'body-1'}>don't have an account?</p>
                        <a className={'register'} href={'/register'}>REGISTER</a>
                    </div>
                </div>
            );
        } else {  // this.props.page === Pages.SIGN_UP
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
                        <button id={'submit-register'} className={'btn-primary login-submit'} onClick={this.handleSubmitClick}>register</button>
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

        return (
            <div className={'login-fields-container'}>
                {this.getCurrentForm()}
            </div>
        );
    }
}
