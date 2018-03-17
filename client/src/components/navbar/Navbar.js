import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import { FileDownload } from 'material-ui-icons';
import Tooltip from 'material-ui/es/Tooltip/Tooltip';
import { Manager, Target, Popper } from 'react-popper';
import Grow from 'material-ui/es/transitions/Grow';
import Paper from 'material-ui/es/Paper/Paper';
import MenuList from 'material-ui/Menu/MenuList';
import ClickAwayListener from 'material-ui/es/utils/ClickAwayListener';
import classNames from 'classnames';
import TorrentStatus from './TorrentStatus';
import BandWidthStatus from '../shared/BandWidthStatus';
import * as axios from 'axios/index';
import Magnet from './Magnet';
import Divider from 'material-ui/es/Divider/Divider';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  colorPrimary: {
    backgroundColor: '#38393a'
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    color: '#FB8C00'
  },
  paper: {
    marginRight: theme.spacing.unit * 2
  },
  popperClose: {
    pointerEvents: 'none'
  },
  hr: {
    backgroundColor: 'rgba(144, 100, 100, 0.61)',
    margin: '10px 0'
  }
});

class Navbar extends React.Component {
  state = {
    open: false,
    uploadSpeed: '0.00 Kb/s',
    downloadSpeed: '0.00 Kb/s',
    magnetLink: '',
    torrents: []
  };

  componentWillMount() {
    (async () => {
      const response = await this.getTorrents();
      console.log(response.torrents);
      this.setState({
        torrents: response.torrents.map(torrent => {
          return { hash: torrent.hash };
        })
      });
    })();

    setInterval(() => {
      (async () => {
        const res = await this.getGlobalStatus();
        this.setState({
          uploadSpeed: res.data.status.upload,
          downloadSpeed: res.data.status.download
        });
      })();
    }, 10000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  getGlobalStatus() {
    return axios.get('api/status');
  }

  handleMagnetChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleMagnetLinkDispatch = async () => {
    const hash = await this.postMagnet();
    const isAlreadyStored = this.state.torrents.find(
      torrent => torrent.hash === hash
    );
    if (!isAlreadyStored) this.state.torrents.push({ hash });

    this.setState({
      magnetLink: ''
    });
    // const hash = await this.getMagnetHash();
    // const hash = '92b4d5ea2d21bc2692a2cb1e5b9fbecd489863ec'
    // const files = await this.getFiles(hash);
    // const filename = files.find(file =>
    //   file.name.toLowerCase().includes('.mp4')
    // );
    // this.setState({
    //   videoSrc: `/api/torrent/${hash}/${filename.id}`
    // });
  };

  async getTorrents() {
    try {
      const response = await axios.get('/api/torrents');
      return response.data;
    } catch (err) {
      console.log('postMagnet', err);
    }
  }

  async postMagnet() {
    try {
      const response = await axios.post('/api/magnet', {
        magnet: this.state.magnetLink
      });
      return response.data.hash;
    } catch (err) {
      console.log('postMagnet', err);
    }
  }

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = () => {
    if (!this.state.open) {
      return;
    }

    // setTimeout to ensure a close event comes after a target click event
    this.timeout = setTimeout(() => {
      this.setState({ open: false });
    });
  };

  render() {
    const { classes } = this.props;
    const { open, downloadSpeed, uploadSpeed, torrents } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.colorPrimary}>
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={`${classes.flex} ${classes.title}`}
            >
              Webflix
            </Typography>

            <Magnet
              value={this.state.magnetLink}
              onChange={this.handleMagnetChange.bind(this)}
              onClick={this.handleMagnetLinkDispatch.bind(this)}
            />

            <BandWidthStatus
              downloadSpeed={downloadSpeed}
              uploadSpeed={uploadSpeed}
            />

            <Manager>
              <Target>
                <Tooltip
                  id="tooltip-bottom"
                  title="Downloads"
                  placement="bottom"
                >
                  <IconButton
                    aria-owns={open ? 'menu-appbar' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                    color="inherit"
                  >
                    <FileDownload />
                  </IconButton>
                </Tooltip>
              </Target>
              <Popper
                placement="bottom-end"
                eventsEnabled={open}
                className={classNames({ [classes.popperClose]: !open })}
              >
                <ClickAwayListener onClickAway={this.handleClose}>
                  <Grow
                    in={open}
                    id="menu-list"
                    style={{ transformOrigin: '0 0 0' }}
                  >
                    <Paper style={{ width: '350px', padding: '15px' }}>
                      <Typography variant="subheading">
                        Downloads ({torrents.length})
                      </Typography>
                      {torrents.length
                        ? torrents.map(torrent => {
                            return (
                              <React.Fragment key={torrent.hash}>
                                <TorrentStatus hash={torrent.hash} />{' '}
                                <Divider classes={{ root: classes.hr }} />
                              </React.Fragment>
                            );
                          })
                        : 'No downloads yet'}
                    </Paper>
                  </Grow>
                </ClickAwayListener>
              </Popper>
            </Manager>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Navbar);
