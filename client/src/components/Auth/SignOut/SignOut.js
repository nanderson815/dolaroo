import React from 'react';
import { withRouter } from 'react-router-dom'
import { Redirect } from 'react-router-dom'

import { withFirebase } from '../Firebase/FirebaseContext';
import AuthUserContext from '../Session/AuthUserContext';
import SignOutAvatar from './SignOutAvatar'

class SignOutButton extends React.Component {

  handleSignout = async (event) => {
    await this.props.firebase.doSignOut();
    console.log("Logged out");
    this.props.history.push("/signin"); 
  }

  render() {
    return(
      <div>
        <AuthUserContext.Consumer>
          {user => user.authUser ? null : <Redirect to="/signin" />}
        </AuthUserContext.Consumer>

        <a href="#!" onClick={this.handleSignout}>
          <SignOutAvatar />
        </a>
      </div>
    )
  }
}

export default withRouter(withFirebase(SignOutButton));