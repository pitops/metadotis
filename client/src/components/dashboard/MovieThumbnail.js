import Card from 'material-ui/Card/Card';
import React from 'react';
import Button from 'material-ui/es/Button/Button';
import withStyles from 'material-ui/es/styles/withStyles';
import CardContent from 'material-ui/es/Card/CardContent';

import classNames from './MovieThumbnail.scss';

const styles = theme => ({
  button: {
    width: '100%'
  }
});

const MovieThumbnail = props => {
  const { poster, classes } = props;
  const posterStyle = { backgroundImage: `url( ${poster} )` };

  return (
    <Card>
      <CardContent>
        <Button size="small" className={classes.button}>
          <div
            className={classNames['movie-thumbnail-image']}
            style={posterStyle}
          />
        </Button>
      </CardContent>
    </Card>
  );
};

export default withStyles(styles)(MovieThumbnail);
