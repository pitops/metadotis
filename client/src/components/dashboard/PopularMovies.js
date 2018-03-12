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
    const height = 600;
    const width = 400;

    const url = template.replace('{width}', width).replace('{height}', height);

    return url;
  }

  render() {
    const { movies } = this.state;

    return (
      <Grid container justify="center" spacing={24}>
        {movies.map(movie => {
          return (
            <Grid item sm={3}>
              <MovieThumbnail
                poster={this.configurePosterDimensions(movie.posterData)}
                key={movie.id}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

export default PopularMovies;
