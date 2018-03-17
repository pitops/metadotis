import React from 'react';
import Grid from 'material-ui/es/Grid/Grid';
import FormControl from 'material-ui/es/Form/FormControl';
import Input from 'material-ui/es/Input/Input';
import InputAdornment from 'material-ui/es/Input/InputAdornment';
import Icon from 'material-ui/es/Icon/Icon';
import IconButton from 'material-ui/es/IconButton/IconButton';
import { Send } from 'material-ui-icons';

const Magnet = props => {
  const { magnetLink, onChange, onClick } = props;

  return (
    <Grid container justify="center" spacing={24}>
      <Grid item sm={6}>
        <FormControl fullWidth>
          {/*<InputLabel htmlFor="magnetLink">Magnet link</InputLabel>*/}
          <Input
            id="magnetLink-input"
            value={magnetLink}
            onChange={onChange('magnetLink')}
            startAdornment={
              <InputAdornment position="start">
                <Icon>wifi_tethering</Icon>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={onClick}>
                  <Send />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default Magnet;
