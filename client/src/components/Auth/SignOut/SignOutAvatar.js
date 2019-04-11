import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import Avatar from '@material-ui/core/Avatar';
import VerifiedUser from '@material-ui/icons/VerifiedUser';

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
        <VerifiedUser />
      </Avatar>
  );
}

IconAvatars.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IconAvatars);
