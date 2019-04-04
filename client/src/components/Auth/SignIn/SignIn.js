import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'

import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase/FirebaseContext';
import AuthUserContext from '../Session/AuthUserContext';
import User from "../Firebase/User"

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
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

  onSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state;
    const user = new User();

    this.setState({ ...INITIAL_STATE });

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then((authUser) => {
        return(user.addUserToFirestore(this.props.firebase.db, authUser));
      })
      .then(() => {
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

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleGoogleLogin = (e) => {
    e.preventDefault();

    const user = new User();

    this.props.firebase
      .doSignInWithGoogle()
      .then((authUser) => {
        console.log("Logged in with google to firebase");
        return(user.addUserToFirestore(this.props.firebase.db, authUser));
      })
      .then(() => {
        console.log("Added to firebase");
      })
      .catch(err => {
        console.error("Error logging in with google", err);
      });
  }

  render() {
    let firebaseAuthKey;
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    let SignInScreen;

    if (localStorage.getItem(firebaseAuthKey) === "1") {
      SignInScreen = <p>Loading New Page After Google Login ...</p>;
    }
    else {
      SignInScreen = 
        <form className="white" onSubmit={this.onSubmit}>
          <h5 className="grey-text text-darken-3">Sign In</h5>
          <div className="active input-field">
            <label htmlFor="email">Email</label>
            <input type="email" id='email' name='email' value={email} onChange={this.onChange} />
          </div>
          <div className="active input-field">
            <label htmlFor="password">Password</label>
            <input type="password" id='password' name='password' value={password} onChange={this.onChange} />
          </div>
          <div className="input-field">
            <button disabled={isInvalid} className="btn lighten-1 z-depth-0">Login</button>
            {error && <p>{error.message}</p>}
          </div>
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>    
          <button onClick={this.handleGoogleLogin} className="btn lighten-1 z-depth-0">SignIn With Google</button>  
        </form>
    }

    return (
      <div className="container">
        <AuthUserContext.Consumer>
          {authUser =>
          authUser ? <Redirect to="/dashboard" /> : null
          }
        </AuthUserContext.Consumer>
        {SignInScreen}
      </div>
    );
  }
}

const SignInForm = withRouter(withFirebase(SignInFormBase));
export default SignInForm;