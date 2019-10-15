import React, { Component } from 'react';
import'../css/Login.css';
import { Redirect } from "react-router";

class Login extends Component {
    render() {
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
        this.state = {isExistingUser: true,  fullname: '', username: '', email: '', password: '', auth: false};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.getCurrentForm = this.getCurrentForm.bind(this);
    }

    firebaseError(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
    }

    handleSubmit(event) {
        if (event.target.id === 'submitLogin') {
            this.props.firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(this.firebaseError);

            var user = this.props.firebase.auth().currentUser;
            if (user) {
                this.setState({auth: true});
            }
        } else {
            this.props.firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(this.firebaseError);
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

    getCurrentForm() {
        if (this.state.isExistingUser) {
            return(
                <div className={'login-form'}>
                    <div>
                        <input className={'login-input'} type={'email'} name={'email'} placeholder={'email'} value={this.state.email} onChange={this.handleChange} />
                        <input className={'login-input'} type={'password'} name={'password'} placeholder={'password'} value={this.state.password} onChange={this.handleChange} />
                    </div>
                    <div style={{'margin': '10px 0'}}>
                        <a className='forgot'>forgot password?</a>
                    </div>
                    <div style={{'textAlign': 'center'}}>
                        <button id={'submitLogin'} className={'login-submit btn-open'} onClick={this.handleSubmit}>login</button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={'login-form'} onSubmit={this.handleSubmit}>
                    <div>
                        <input className={'login-input'} type={'text'} name={'fullname'} placeholder={'fullname'} value={this.state.fullname} onChange={this.handleChange} />
                        {/*<input className='login-input' type='text' name='username' placeholder='username' value={this.state.username} onChange={this.handleChange} />*/}
                        <input className={'login-input'} type={'email'} name={'email'} placeholder={'email'} value={this.state.email} onChange={this.handleChange} />
                        <input className={'login-input'} type={'password'} name={'password'} placeholder={'password'} value={this.state.password} onChange={this.handleChange} />
                    </div>
                    <div style={{'textAlign': 'center'}}>
                        <button id={'submitRegister'} className={'login-submit btn-open'} onClick={this.handleSubmit}>register</button>
                    </div>
                </div>
            );
        }
    }

    render() {
        if (this.state.auth) {
            return (
                <Redirect to={'/home'}/>
            );
        }


        let styleLogin = {'marginRight': '5px', 'color': '#467c95'};
        let styleSignUp = {'marginLeft': '5px', 'color': '#f48a84'};

        if (this.state.isExistingUser) {
            styleLogin = {'marginRight': '5px', 'color': '#f48a84'};
            styleSignUp = {'marginLeft': '5px' , 'color': '#467c95'};
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
