import React from 'react';
import { ArrowUpward, ArrowDownward } from 'material-ui-icons';
import Typography from 'material-ui/es/Typography/Typography';
import { withStyles } from 'material-ui/styles/index';
import amber from 'material-ui/colors/amber';

const styles = {
  root: {
    color: amber[600],
    minWidth: '65px'
  },
  icon: {
    margin: '3px'
  }
};

const BandWidthStatus = props => {
  const { classes, uploadSpeed, downloadSpeed } = props;

  return (
    <React.Fragment>
      <ArrowUpward fontSize={true} className={classes.icon} />
      <Typography
        classes={{
          root: classes.root
        }}
        variant="body2"
      >
        {uploadSpeed}
      </Typography>

      <Typography>&nbsp;&nbsp;</Typography>

      <ArrowDownward fontSize={true} className={classes.icon} />
      <Typography
        classes={{
          root: classes.root
        }}
        variant="body2"
      >
        {downloadSpeed}
      </Typography>
    </React.Fragment>
  );
};

export default withStyles(styles)(BandWidthStatus);
