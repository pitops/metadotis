import React from 'react';
import { ArrowUpward, ArrowDownward } from 'material-ui-icons';
import Typography from 'material-ui/es/Typography/Typography';
import * as axios from 'axios/index';
import { withStyles } from 'material-ui/styles/index';
import amber from 'material-ui/colors/amber';

const styles = {
  root: {
    color: amber[600]
  },
  icon: {
    margin: '3px'
  }
};

class GlobalSpeed extends React.Component {
  state = {
    uploadSpeed: '0.00 Kb/s',
    downloadSpeed: '0.00 Kb/s'
  };

  componentWillMount() {
    setInterval(() => {
      (async () => {
        const status = await this.getGlobalStatus();
        this.setState({
          uploadSpeed: status.data.upload,
          downloadSpeed: status.data.download
        });
      })();
    }, 10000);
  }

  getGlobalStatus() {
    return axios.get('api/status');
  }

  render() {
    const { uploadSpeed, downloadSpeed } = this.state;
    const { classes } = this.props;

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
  }
}

export default withStyles(styles)(GlobalSpeed);
