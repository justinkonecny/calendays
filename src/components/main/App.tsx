import React, { Component } from 'react';
import {MainRoutes} from '../../MainRoutes';
import '../../css/main/App.scss';

interface AppProps {
  firebase: any;
}

export class App extends Component<AppProps, {}> {
  render() {
    return (
      <div className={'App'}>
        <MainRoutes firebase={this.props.firebase} />
      </div>
    );
  }
}
