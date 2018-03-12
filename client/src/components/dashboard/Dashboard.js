import React, { Component } from 'react';
import Grid from 'material-ui/es/Grid/Grid';
import * as axios from 'axios';
import Navbar from '../navbar/Navbar';
import PopularMovies from './PopularMovies';

class Dashboard extends Component {
  state = {
    videoSrc: undefined
  };

  componentWillMount() {
    const res = axios.get('api/search/torrents?q=robot&page=1');
  }

  render() {
    return (
      <React.Fragment>
        <Navbar />

        <Grid container justify="center" spacing={24}>
          <Grid item sm={6}>
            <video
              autoPlay
              src={this.state.videoSrc}
              height="360px"
              width="100%"
              controls
            />
          </Grid>
        </Grid>

        <PopularMovies />
      </React.Fragment>
    );
  }
}

export default Dashboard;
