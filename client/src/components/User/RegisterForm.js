import React, { Component } from 'react';
import { withFirebase } from '../Auth/Firebase/FirebaseContext';
import { withRouter } from 'react-router-dom';
import UserAPI from "./UserAPI";

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

  onSubmit = event => {
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

  render() {
    const {
      displayName,
      email,
      foundEmail,
      passwordOne,
      passwordTwo,
      message
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      displayName === '';

    return (
      <div className="container">
        <form className="white" onSubmit={this.onSubmit}>
          <h5 className="grey-text text-darken-3">Register User</h5>
          <div className="input-field">
            <label htmlFor="displayName">Display Name</label>
            <input type="text" name='displayName' value={displayName} onChange={this.onChange} />
          </div>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input disabled={foundEmail} type="email" name='email' value={email} onChange={this.onChange} />
          </div>
          <div className="input-field">
            <label htmlFor="passwordOne">Password</label>
            <input type="password" name='passwordOne' value={passwordOne} onChange={this.onChange} />
          </div>
          <div className="input-field">
            <label htmlFor="passwordTwo">Confirm Password</label>
            <input type="password" name='passwordTwo' value={passwordTwo} onChange={this.onChange} />
          </div>
          <div className="input-field">
            <button disabled={isInvalid} className="btn lighten-1 z-depth-0">Sign Up</button>
            <p>Note: Administrator must enable your email in order to register and get access to this app</p>
            <p>{message}</p>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(withFirebase(Register));