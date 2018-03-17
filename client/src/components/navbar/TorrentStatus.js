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
    progress: '0%',
    name: ''
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // get torrent by using hash
    const { hash } = this.props;

    this.timer = setInterval(() => {
      (async () => {
        const response = await this.getTorrent(hash);
        this.setState({
          uploadSpeed: response.data.torrent.status.upload,
          downloadSpeed: response.data.torrent.status.download,
          progress: response.data.torrent.status.progress,
          name: this.extractName(response.data.torrent.files)
        });

        if (parseInt(this.state.progress) === 100) {
          clearInterval(this.timer);
        }
      })();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  extractName(files) {
    const keywords = [
      '720p',
      '1080p',
      'BluRay',
      'x264',
      '-',
      'YTS.AM',
      '.mp4',
      '[',
      ']'
    ];
    let fileName = files.find(file => file.name.includes('.mp4'));

    if (fileName) {
      fileName = fileName.name;
      keywords.forEach(keyword => {
        fileName = fileName.replace(keyword, '');
      });
      return fileName.replace(/\./g, ' ');
    }

    return 'Cannot extract filename';
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
        buffer: completed + diff
      });
    }
  };

  render() {
    const { classes } = this.props;
    const { progress, name, buffer, downloadSpeed, uploadSpeed } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant="caption">
          {name} ({progress})
        </Typography>
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
