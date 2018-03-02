import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';
import Typography from 'material-ui/es/Typography/Typography';
import BandWidthStatus from '../shared/BandWidthStatus';
import classNames from './TorrentStatus.scss';
import * as axios from 'axios';

const styles = {
  root: {
    flexGrow: 1
  }
};

class TorrentStatus extends React.Component {
  state = {
    buffer: 10,
    uploadSpeed: '0.00 Kb/s',
    downloadSpeed: '0.00 Kb/s',
    progress: '0%'
  };

  componentWillMount() {
    // get torrent by using hash
    const hash = '0b4188030fa2ae975f4c2a7f4cad6b1114b0c472';

    // this.timer = setInterval(() => {
    //   (async () => {
    //     const response = await this.getTorrent(hash);
    //     this.setState({
    //       uploadSpeed: response.data.status.upload,
    //       downloadSpeed: response.data.status.download,
    //       progress: response.data.status.progress
    //     });
    //
    //     if (parseInt(this.state.progress) === 100) {
    //       clearInterval(this.timer)
    //     }
    //   })();
    // }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  async getTorrent(hash) {
    return await axios.get('/api/torrent/' + hash);
  }

  timer = null;

  progress = () => {
    const { completed } = this.state;
    if (completed > 100) {
      this.setState({ completed: 0, buffer: 10 });
    } else {
      const diff = Math.random() * 10;
      const diff2 = Math.random() * 10;
      this.setState({
        completed: completed + diff,
        buffer: completed + diff + diff2
      });
    }
  };

  render() {
    const { classes } = this.props;
    const { progress, buffer, downloadSpeed, uploadSpeed } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="body2">Avengers 3 ({progress})</Typography>
        <LinearProgress
          color="secondary"
          variant="buffer"
          value={parseInt(progress)}
          valueBuffer={buffer}
        />
        {parseInt(progress) < 100 ? (
          <div className={classNames.speedAndProgressContainer}>
            <BandWidthStatus
              downloadSpeed={downloadSpeed}
              uploadSpeed={uploadSpeed}
            />
          </div>
        ) : (
          <Typography variant="body2">Download complete</Typography>
        )}
      </div>
    );
  }
}

TorrentStatus.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TorrentStatus);
