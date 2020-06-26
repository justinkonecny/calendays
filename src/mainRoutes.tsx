import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Login} from './components/main/Login';
import {Home} from './components/main/Home';
import {Reset} from './components/main/Reset';
import {Pages} from './data/Pages';

export interface MainRoutesProps {
    firebase: any;
}

export class MainRoutes extends Component<MainRoutesProps, {}> {
    render() {
        return (
            <Switch>
                <Route exact path={'/'} render={() => (<Login firebase={this.props.firebase}/>)}/>
                <Route exact path={'/home'} render={() => (<Home firebase={this.props.firebase} page={Pages.HOME}/>)}/>
                <Route exact path={'/notifications'} render={() => (<Home firebase={this.props.firebase} page={Pages.NOTIFICATIONS}/>)}/>
                <Route exact path={'/user'} render={() => (<Home firebase={this.props.firebase} page={Pages.USER}/>)}/>
                <Route exact path={'/reset'} render={() => (<Reset firebase={this.props.firebase}/>)}/>
                <Route path={'*'} render={() => (<Redirect to={'/'}/>)}/>
            </Switch>
        );
    }
}
