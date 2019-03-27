import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';

export function MainRoutes() {
    return (
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="*" render={() => (<Redirect to="/"/>)}/>
        </Switch>
    );
}
