import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import { ArrowDownward, ArrowUpward, FileDownload } from 'material-ui-icons';
import Tooltip from 'material-ui/es/Tooltip/Tooltip';
import { Manager, Target, Popper } from 'react-popper';
import Grow from 'material-ui/es/transitions/Grow';
import Paper from 'material-ui/es/Paper/Paper';
import MenuList from 'material-ui/Menu/MenuList';
import ClickAwayListener from 'material-ui/es/utils/ClickAwayListener';
import classNames from 'classnames';
import * as axios from 'axios';
import GlobalSpeed from './GlobalSpeed';

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
  }
});

class Navbar extends React.Component {
  state = {
    open: false
  };

  componentWillUnmount() {
    clearTimeout(this.timeout);
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
    const { open } = this.state;

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

            <GlobalSpeed />

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
                      <MenuList role="menu">
                        {/*<MenuItem onClick={this.handleClose}>Profile</MenuItem>*/}
                        {/*<MenuItem onClick={this.handleClose}>My account</MenuItem>*/}
                        {/*<MenuItem onClick={this.handleClose}>Logout</MenuItem>*/}
                      </MenuList>
                      No downloads active
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
