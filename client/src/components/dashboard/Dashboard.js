import React, { Component } from 'react';
import Grid from 'material-ui/es/Grid/Grid';
import PopularMovies from './PopularMovies';

class Dashboard extends Component {
  state = {
    videoSrc: undefined
  };

  componentWillMount() {
    // const res = axios.get('api/search/torrents?q=robot&page=1');
  }

  render() {
    return (
      <React.Fragment>
        <PopularMovies />
      </React.Fragment>
    );
  }
}

export default Dashboard;
