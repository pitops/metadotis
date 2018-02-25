import React, { Component } from 'react';
import Icon from 'material-ui/es/Icon/Icon';
import InputAdornment from 'material-ui/es/Input/InputAdornment';
import Input from 'material-ui/es/Input/Input';
import InputLabel from 'material-ui/es/Input/InputLabel';
import FormControl from 'material-ui/es/Form/FormControl';
import Grid from 'material-ui/es/Grid/Grid';
import { Send } from 'material-ui-icons';
import IconButton from 'material-ui/es/IconButton/IconButton';
import * as axios from 'axios';

class Dashboard extends Component {
  state = {
    magnetLink: '',
    videoSrc: undefined
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleMagnetLinkDispatch = async () => {
    const hash = await this.getMagnetHash();
    // const hash = '92b4d5ea2d21bc2692a2cb1e5b9fbecd489863ec'
    const files = await this.getFiles(hash);
    const filename = files.find(file => file.includes('.mp4'));
    this.setState({
      videoSrc: `/api/file?hash=${hash}&name=${filename}`
    });
  };

  async getMagnetHash() {
    try {
      const response = await axios.post('/api/magnet', {
        magnet: this.state.magnetLink
      });
      return response.data.hash;
    } catch (err) {
      console.log('getMagnetHash', err);
    }
  }

  async getFiles(hash) {
    try {
      const response = await axios.get(`/api/files?hash=${hash}`);
      return response.data.files;
    } catch (err) {
      console.log('getFiles', err);
    }
  }

  render() {
    return (
      <React.Fragment>
        <Grid container justify="center" spacing={24}>
          <Grid item sm={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="magnetLink">Magnet link</InputLabel>
              <Input
                id="magnetLink-input"
                value={this.state.magnetLinK}
                onChange={this.handleChange('magnetLink')}
                startAdornment={
                  <InputAdornment position="start">
                    <Icon>wifi_tethering</Icon>
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={this.handleMagnetLinkDispatch}>
                      <Send />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container justify="center" spacing={24}>
          <Grid item sm={6}>
            <video
              autoPlay
              src={this.state.videoSrc}
              height="360px"
              width="100%"
              controls
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default Dashboard;
