import React from 'react';
import UserForm from "./UserForm"
  
class UserPage extends React.Component {

  render() {
    // deconstrcut prop from authContext
    let { uid } =  this.props.location.state;

    // Some props take time to get ready so return null when uid not avaialble
    if (uid === null) {
      return null;
    }

    return ( 
      <div>
        <UserForm 
          uid={uid}
        />
      </div>
    );
  }
}

export default UserPage;