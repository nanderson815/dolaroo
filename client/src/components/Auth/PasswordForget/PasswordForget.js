import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { withFirebase } from '../Firebase/FirebaseContext';

const PasswordForgetPage = () => (
  <div>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
  message: null,
};

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

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    const { email, message } = this.state;

    const isInvalid = email === '';

    return (
        <div className="container">
            <div className="card">
                <div className="card-content">
                    <span className="card-title">Register</span>
                    <form className={classes.container}>
                        <TextField
                        id="email"
                        label="Email"
                        placeholder="example@gmail.com"
                        multiline
                        className={classes.textField}
                        type="email"
                        name="email"
                        autoComplete="email"
                        margin="normal"
                        value={email}
                        onChange={this.onChange}
                        />

                    </form>
                    <br />
                    <div className="row">
                        <Button disabled={isInvalid} onClick={this.onSubmit} variant="contained" color="primary" className={classes.button}>
                            Reset My Password
                        </Button>
                    </div>
                    <p>{message}</p>

                </div>
            </div>
      </div>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to="/pw-forget">Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withStyles(styles)(withFirebase(PasswordForgetFormBase));

export { PasswordForgetForm, PasswordForgetLink };