import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { withAuthUserContext } from '../Auth/Session/AuthUserContext';

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

  let avatar;
  if (props.user.displayName) {
    let res = props.user.displayName.split(" ");
    let initials = "";
    if (res[0][0]) {
      initials += res[0][0];
      if (res[1][0]) {
        initials += res[1][0];
      }
    } else {
      initials = "OP";
    }
    avatar = <Avatar className={classes.pinkAvatar}>{initials}</Avatar>;
  } else {
    avatar = 
    <Avatar className={classes.pinkAvatar}>
      <AccountCircle />
    </Avatar>;
  }
  return (
    <div>
      {avatar}
    </div>
  );
};

IconAvatars.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withAuthUserContext(withStyles(styles)(IconAvatars));
