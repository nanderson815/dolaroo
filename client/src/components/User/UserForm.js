import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import NumberFormat from 'react-number-format';
import localStyles from './User.module.css';
import Button from '@material-ui/core/Button';

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

function NumberFormatPhone(props) {
  const { inputRef, onChange, ...other } = props;

  return (
      <NumberFormat
          {...other}
          className={localStyles.input}
          getInputRef={inputRef}
          onValueChange={values => {
              onChange({
                  target: {
                      value: values.value,
                  },
              });
          }}
          format="(###) ###-####"
          mask=""
      />
  );
}
class UserForm extends React.Component {
  state = {
    id: this.props.id,
    firstName: "",
    lastName: "",
    photoURL: "",
    phoneNumber: "",
    email: "",
    uid: "",
    claims: "noauth",
    message: ""
  };

  fetchUser = (id) => {
    UserAPI.get(id)
    .then(user => {
      this.setState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        photoURL: user.photoURL || "",
        phoneNumber: user.phoneNumber || "",
        uid: user.uid || "",
        claims: user.claims || "noauth",
        email: user.email
      });
      // Dont need to get custom claims since they are passed in props from context
      // and can not be changed here
    })
    .catch(err => {
      console.error(`Error getting user ${err}`);
      this.setState({error: `Error getting user ${err}`});
    });
  };

  componentDidMount() {
    console.log(`id: ${this.state.id}`);
    if (this.state.id) {
      this.fetchUser(this.state.id);
    } else {
    }
  }

  addUser = () => {
    console.log(`adding user to db`);
    const user = this.state;
    UserAPI.updateFBOnly(user).then (id => {
      // set message to show update
      this.setState({
        message: "New User Added - they must Sign Up to authorize",
        id: id
      });
    }).catch (err => {
      // set message to show update
      this.setState({message: `Error adding user ${err}`});
    });
  }

  updateUser = () => {
    console.log(`updating db with user.uid:${this.state.uid}`);

    const user = this.state;
    UserAPI.update(user).then (user => {
      // set message to show update
      this.setState({message: "User Updated"});
    }).catch (err => {
      // set message to show update
      this.setState({message: `Error updating user ${err}`});
    });
  }

  saveUser = (e) => {
    e.preventDefault();
    // Update current user in firestore (and auth for some fields)
    if (this.state.id) {
      this.updateUser();
    } else {
      this.addUser();
    }
  };

  onChange = event => {

    this.setState({
        [event.target.name]: event.target.value
    });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };


  render() {
    const { classes } = this.props;

    const {
      firstName,
      lastName,
      photoURL,
      phoneNumber,
      email,
      claims,
      message
      } = this.state;

    let buttonText, emailEnabled;
    if (this.state.id) {
      buttonText = "Update";
      emailEnabled = false;
    } else {
      buttonText = "Create";
      emailEnabled = true;
    }

    const isValid = 
      firstName !== "" &&
      lastName !== "" &&
      phoneNumber !== "";

    return ( 
      <div className="container">
        <div className="card">
          <div className="card-content">
            <span className="card-title">User (Role: {claims})</span>

            <form className={classes.container}>
              <TextField
              disabled={!emailEnabled}
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

              <TextField
              id="firstName"
              name="firstName"
              label="First Name"
              value={firstName}
              placeholder="John"
              multiline
              className={classes.textField}
              type="text"
              margin="normal"
              onChange={this.onChange}
              />

              <TextField
              id="lastName"
              name="lastName"
              label="Last Name"
              value={lastName}
              placeholder="Smith"
              multiline
              className={classes.textField}
              type="text"
              margin="normal"
              onChange={this.onChange}
              />

              <TextField
              id="photoURL"
              name="photoURL"
              value={photoURL}
              label="Photo URL"
              placeholder="http://www.image.com/image.png"
              multiline
              className={classes.textField}
              type="text"
              margin="normal"
              onChange={this.onChange}
              />

              <TextField
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              label="Phone Number"
              multiline
              className={classes.textField}
              margin="normal"
              onChange={this.handleChange('phoneNumber')}
              InputProps={{
                  inputComponent: NumberFormatPhone,
              }}
              />
                            
            </form>
            <br />
            <div className="row">
                <Button disabled={!isValid} onClick={this.saveUser} variant="contained" color="primary" className={classes.button}>
                  {buttonText}
                </Button>
            </div>

            <p>{message}</p>

          </div>
        </div>
      </div>
    );  
  }
}

export default withStyles(styles)(UserForm);