import React from 'react';
import { withAuthUserContext } from "../Auth/Session/AuthUserContext";
import AccountForm from "./AccountForm"
  
class Account extends React.Component {

  onChange = event => {
      this.setState({
          [event.target.name]: event.target.value
      });
  };

  render() {

    // deconstrcut prop from authContext
    let {
      uid,
      displayName,
      email,
      phoneNumber,
      claims
    } = this.props.user;
    displayName = displayName || "";
    email = email || "";
    phoneNumber = phoneNumber || "";
    claims = claims || "";

    // Some props take time to get ready so return null when uid not avaialble
    if (uid === null) {
      return null;
    }

    return ( 
      <div>
        <AccountForm 
          uid={uid}
          displayName={displayName}
          email={email}
          phoneNumber={phoneNumber}
          claims={claims}
        />
      </div>
    );
  }
}

export default withAuthUserContext(Account);