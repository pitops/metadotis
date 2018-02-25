import React, { Component } from 'react';

import withRoot from '../../withRoot';
import classes from './app.scss';
import Dashboard from '../dashboard/Dashboard';

class App extends Component {
  state = {
    response: '',
    open: false
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.message }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api');
    const body = await response.json();

    if (response.status !== 200) throw Error('API not connected');

    return body;
  };

  render() {
    const { open } = this.state;

    return (
      <div className={classes.main}>
        <Dashboard />
      </div>
    );
  }
}

export default withRoot(App);
