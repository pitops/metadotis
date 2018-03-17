import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import withRoot from '../../withRoot';
import classes from './app.scss';
import Dashboard from '../dashboard/Dashboard';
import Stream from '../torrent/Stream';
import { Route } from 'react-router-dom';
import Navbar from '../navbar/Navbar';

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
      <BrowserRouter>
        <div className={classes.main}>
          <Navbar />
          <Route path="/stream" component={Stream} />
          <Route path="/" exact component={Dashboard} />
        </div>
      </BrowserRouter>
    );
  }
}

export default withRoot(App);
