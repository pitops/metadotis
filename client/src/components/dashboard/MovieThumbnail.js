import React from 'react';
import Card from 'material-ui/Card/Card';
import CardContent from 'material-ui/es/Card/CardContent';
import Button from 'material-ui/es/Button/Button';

const MovieThumbnail = props => {
  const { poster } = props;
  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Button size="small">
            <img src={poster} />
          </Button>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default MovieThumbnail;
