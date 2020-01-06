import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import Login from './components/main/Login';
import Home from './components/main/Home';
import Reset from './components/main/Reset';

class MainRoutes extends Component {
    render() {
        return (
            <Switch>
                <Route exact path={'/'} render={() => (<Login firebase={this.props.firebase}/>)}/>
                <Route exact path={'/home'} render={() => (<Home firebase={this.props.firebase}/>)}/>
                <Route exact path={'/reset'} render={() => (<Reset firebase={this.props.firebase}/>)}/>
                <Route path={'*'} render={() => (<Redirect to={'/'}/>)}/>
            </Switch>
        );
    };
}

export default MainRoutes;
