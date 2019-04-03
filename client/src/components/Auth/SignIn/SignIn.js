import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase/FirebaseContext';

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;
    const db = this.props.firebase.db;  // ref to firebase firestore()

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then((authUser) => {
        this.setState({ ...INITIAL_STATE });
        let docRef = db.collection("users").doc(authUser.user.uid);
        docRef.get().then( (doc) => {
          if (doc.exists) {
            // update
            console.log("User updated");
            return db.collection('users').doc(authUser.user.uid).update({
              email: email
            });
          }
          // cretae if not existing
          console.log("New user created");
          return db.collection('users').doc(authUser.user.uid).set({
            email: email
          });
        });
      })
      .then(() => {
        // redirect home
        this.props.history.push("/dashboard"); 
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
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <div className="container">
        <form className="white" onSubmit={this.onSubmit}>
          <h5 className="grey-text text-darken-3">Sign In</h5>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input type="email" name='email' value={email} onChange={this.onChange} />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input type="password" name='password' value={password} onChange={this.onChange} />
          </div>
          <div className="input-field">
            <button disabled={isInvalid} className="btn lighten-1 z-depth-0">Login</button>
            {error && <p>{error.message}</p>}
          </div>
        </form>
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>      
      </div>
    );
  }
}

const SignInForm = withRouter(withFirebase(SignInFormBase));
export default SignInForm;