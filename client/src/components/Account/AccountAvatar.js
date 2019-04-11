import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';

const styles = {
  avatar: {
    margin: 10,
  },
  pinkAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: pink[500],
  },
};

const IconAvatars = (props) => {
  const { classes } = props;
  return (
      <Avatar className={classes.pinkAvatar}>
        <AccountCircle />
      </Avatar>
  );
}

IconAvatars.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IconAvatars);
