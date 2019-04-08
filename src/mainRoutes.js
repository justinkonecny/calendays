import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';

export function MainRoutes() {
    return (
        <Switch>
            <Route exact path="/" component={Login}/>
            <Route path="*" render={() => (<Redirect to="/"/>)}/>
        </Switch>
    );
}
