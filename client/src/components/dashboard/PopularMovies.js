import React from 'react';
import * as axios from 'axios';
import MovieThumbnail from './MovieThumbnail';
import Grid from 'material-ui/es/Grid/Grid';

class PopularMovies extends React.Component {
  state = {
    movies: []
  };

  async componentWillMount() {
    const response = await axios.get('/api/movies/popular');

    this.setState({
      movies: response.data.movies
    });
  }

  configurePosterDimensions(posterData) {
    const { template } = posterData;
    const height = 580;
    const width = 400;

    const url = template
      .replace(/{width}/g, width)
      .replace(/{height}/g, height);

    return url;
  }

  render() {
    const { movies } = this.state;

    return (
      <Grid container justify="center" spacing={24}>
        {movies.map(movie => {
          return (
            <Grid item sm={3} key={movie.id}>
              <MovieThumbnail
                poster={this.configurePosterDimensions(movie.posterData)}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

export default PopularMovies;
