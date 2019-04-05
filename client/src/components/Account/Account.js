import React from 'react';
import User from "../User/User";
import { withAuthUserContext } from '../Auth/Session/AuthUserContext';

const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    error: null,
  };
  
class Account extends React.Component {
    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE};
    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    getCurrentUser = (e) => {
      e.preventDefault();

      const user = new User();

      user.getCurrentUser(this.props.authUser.token)
      .then(user => {
        console.log(`Got current user from firestore: ${user}`);
      })
      .catch(err => {
        console.error(`Error getting user ${err}`);
      })
    }

    render() {
        // destructure
        const {
            firstName,
            lastName,
            phoneNumber,
            error
        } = this.state;

        const isInvalid =
            firstName !== "" ||
            lastName === "" ||
            phoneNumber === "";

        return ( 
            <div className="container">
            <form className="white" onSubmit={this.onSubmit}>
              <h5 className="grey-text text-darken-3">Account</h5>
              <div className="input-field">
                <label htmlFor="firstName">First Name</label>
                <input type="text" name='firstName' value={firstName} onChange={this.onChange} />
              </div>
              <div className="input-field">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" name='lastName' value={lastName} onChange={this.onChange} />
              </div>
              <div className="input-field">
                <label htmlFor="phoneNumber">Password</label>
                <input type="text" name='phoneNumber' value={phoneNumber} onChange={this.onChange} />
              </div>
              <div className="input-field">
                <button disabled={isInvalid} className="btn lighten-1 z-depth-0">Sign Up</button>
                {error && <p>{error.message}</p>}
              </div>
              <button onClick={this.getCurrentUser} className="btn lighten-1 z-depth-0">Test Get User</button>  
            </form>
          </div>
            );
    }
}

export default withAuthUserContext(Account);