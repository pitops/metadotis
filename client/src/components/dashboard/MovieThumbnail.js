import React from 'react';
import Card from 'material-ui/Card/Card';
import CardContent from 'material-ui/es/Card/CardContent';
import Button from 'material-ui/es/Button/Button';
import withStyles from 'material-ui/es/styles/withStyles';

const styles = theme => ({
  button: {
    width: '100%'
  }
});

const MovieThumbnail = props => {
  const { poster, classes } = props;
  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Button size="small" className={classes.button}>
            <img src={poster} />
          </Button>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default withStyles(styles)(MovieThumbnail);
