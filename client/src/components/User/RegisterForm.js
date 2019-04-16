import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { withFirebase } from '../Auth/Firebase/FirebaseContext';
import { withRouter } from 'react-router-dom';
import UserAPI from "./UserAPI";

const styles = theme => ({
  container: {
      display: 'flex',
      flexWrap: 'wrap',
  },
  inputFix: {
      marginTop: 5
  },
  textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 300,
  },
  menu: {
      width: 200,
  },
  formControl: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      minWidth: 300,
  },
  selectEmpty: {
      marginTop: theme.spacing.unit * 2,
  },
});

class Register extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }
  state = {
    email: this.props.email,
    foundEmail: false,
    displayName: '',
    passwordOne: '',
    passwordTwo: '',
    showPasswordOne: false,
    showPasswordTwo: false,
    message: null,
  };

  fetchUser = (email) => {
    // Get with security
    UserAPI.getByEmail(email)
    .then(user => {
        // console.log(`Users in refresh page: ${JSON.stringify(users, null, 2)}`);
        if (user.err) {
          // justy log not found but no biggie
          console.error(user.err);
        } else {
          this.setState({ 
            foundEmail: user.displayName,
            displayName: user.displayName,
            email: user.email,
            message: "User found by email",
          });
        }
    })
    .catch(err => {
        console.error(err); 
    });        
  };

  componentDidMount() {
    // since t hey are auth, uid == id
    console.log(`email: ${this.state.email}`);
    if (this.state.email) {
      this.fetchUser(this.state.email);
    }
  }

  registerUser = event => {
    event.preventDefault();

    // eslint-disable-next-line no-unused-vars
    const { displayName, email, passwordOne } = this.state;
    console.log(this.props);

    // First get the email and ensure it is ready to register
    UserAPI.getByEmail(email)
    .then(user => {
        if (user.err) {
          console.error(user.err);
          this.setState({ message: user.err });
        } else {
          // Now create auth user from signin
          this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
              let userInfo = {...authUser};
              userInfo.displayName = displayName;
              // Now Create the user in firestore
              UserAPI.registerUser(userInfo)
                .then(() => {
                  // redirect home
                  this.props.history.push("/dashboard"); 
                })
                .catch(err => {
                  this.setState({ message: err });
                });
              })
            .catch(err => {
                  console.error(err); 
                  this.setState({ message: err.message });
            });        
        }
    })
    .catch(err => {
        console.error(err); 
        this.setState({ message: err });
    });        
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleClickShowPasswordOne = (e) => {
    e.preventDefault();

    this.setState(state => ({ showPasswordOne: !state.showPasswordOne }));
  };

  handleClickShowPasswordTwo = (e) => {
    e.preventDefault();

    this.setState(state => ({ showPasswordTwo: !state.showPasswordTwo }));
  };


  render() {
    const { classes } = this.props;

    const {
      displayName,
      email,
      passwordOne,
      passwordTwo,
      showPasswordOne,
      showPasswordTwo,
      message
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      displayName === '';

    return (
      <div className="container">
        <div className="card">
          <div className="card-content">
            <span className="card-title">Register</span>
            <form className={classes.container}>
              <TextField
                id="displayName"
                name="displayName"
                label="Display Name"
                placeholder="John Smith"
                multiline
                className={classes.textField}
                type="text"
                margin="normal"
                value={displayName}
                onChange={this.onChange}
              />

              <TextField
                id="email"
                name="email"
                label="Email"
                placeholder="example@gmail.com"
                multiline
                className={classes.textField}
                type="email"
                autoComplete="email"
                margin="normal"
                value={email}
                onChange={this.onChange}
              />

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="passwordOne">Password</InputLabel>
                <Input
                id="passwordOne"
                name="passwordOne"
                type={showPasswordOne ? 'text' : 'password'}
                value={passwordOne}
                onChange={this.onChange}
                endAdornment={
                    <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPasswordOne}
                    >
                        {showPasswordOne ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                }
                />
              </FormControl>
              
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="passwordTwo">Confirm Password</InputLabel>
                <Input
                id="passwordTwo"
                name="passwordTwo"
                type={showPasswordTwo ? 'text' : 'password'}
                value={passwordTwo}
                onChange={this.onChange}
                endAdornment={
                    <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPasswordTwo}
                    >
                        {showPasswordTwo ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                }
                />
              </FormControl>
              
            </form>
            <br />
            <div className="row">
                <Button disabled={isInvalid} onClick={this.registerUser} variant="contained" color="primary" className={classes.button}>
                    Register
                </Button>
            </div>

            <p>Note: Administrator must enable your email in order to register and get access to this app</p>
            <p>{message}</p>

          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(withFirebase(Register)));