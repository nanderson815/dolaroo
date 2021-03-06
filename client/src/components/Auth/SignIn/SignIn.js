import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase/FirebaseContext';
import AuthUserContext from '../Session/AuthUserContext';
import UserAPI from "../../User/UserAPI";
import { Paper, Grid } from '@material-ui/core';


const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
    showPassword: false
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
        margin: "0 auto",
        width: 300,
    },
    menu: {
        width: 200,
    },
    formControl: {
        margin: "0 auto",
        minWidth: 300,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    paper: {
        padding: theme.spacing(3, 2),
        maxWidth: "500px"
    },
    centerText: {
        textAlign: "center"
    },
    centerDiv: {
        margin: "0 auto"
    }
});

class SignInFormBase extends React.Component {
    constructor(props) {
        super(props);

        this._isMounted = false;

        this.state = { ...INITIAL_STATE };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleClickShowPassword = (e) => {
        e.preventDefault();

        this.setState(state => ({ showPassword: !state.showPassword }));
    };

    signInUser = e => {
        e.preventDefault();

        const { email, password } = this.state;

        // dont reset unless goood login
        // this.setState({ ...INITIAL_STATE });

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then((authUser) => {
                // NOTE : DO NOT RESET STATE if component unmounts since we are going to redirect
                // this causes memory leaks - Igot an error explaining all that
                if (this._isMounted) {
                    this.setState({ ...INITIAL_STATE });
                }
            })
            .catch(error => {
                if (this._isMounted) {
                    this.setState({ error });
                }
            });
    };

    handleGoogleLogin = (e) => {
        e.preventDefault();

        this.props.firebase
            .doSignInWithGoogle()
            .then((authUser) => {
                console.log("Logged in with google to firebase");
                return (UserAPI.addAuthUserToFirestore(authUser));
            })
            .then(() => {
                console.log("Added to firebase");
            })
            .catch(err => {
                console.error("Error logging in with google", err);
                if (this._isMounted) {
                    this.setState({ error: err });
                }
            });
    }

    render() {
        const { classes } = this.props;

        let firebaseAuthKey;
        const { email, password, showPassword, error } = this.state;

        const isInvalid = password === '' || email === '';

        let SignInScreen;

        // Add sign in with company password.
        if (localStorage.getItem(firebaseAuthKey) === "1") {
            SignInScreen = <p>Loading New Page After Google Login ...</p>;
        }
        else {
            SignInScreen =
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{ minHeight: '75vh' }}>

                    <Grid
                        item
                        xs={12}
                        md={6}>
                        <Paper className={classes.paper}>
                            <h5 className={`card-title ${classes.centerText}`}>Sign In</h5>
                            <form className={classes.container} onSubmit={this.signInUser} >
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

                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="password">Password</InputLabel>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={this.onChange}
                                        endAdornment={
                                            <IconButton
                                                aria-label="Toggle password visibility"
                                                onClick={this.handleClickShowPassword}
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        }
                                    />
                                </FormControl>
                            </form>
                            <br></br>
                            <div className={classes.centerText}>
                                <Button disabled={isInvalid} onClick={this.signInUser} variant="contained" color="primary" className={classes.button}>
                                    Login
                                </Button>
                            </div>
                            <div className="row">
                                {error && <p>{error.message}</p>}
                            </div>
                            <p>
                                <Link to="/pw-forget">Forgot Password?</Link>
                            </p>
                        </Paper>
                    </Grid>
                </Grid>
        }

        return (
            <div className="container">
                <AuthUserContext.Consumer>
                    {user => user.authUser ? <Redirect to="/dashboard" /> : null}
                </AuthUserContext.Consumer>
                {SignInScreen}
            </div>
        );
    }
}

const SignInForm = withRouter(withFirebase(SignInFormBase));
export default withStyles(styles)(SignInForm);
