import React from 'react';
import RegisterForm from "./RegisterForm";
  
class RegisterPage extends React.Component {

  render() {
    // deconstrcut prop from authContext
    let { email } =  this.props.location.state;

    // Some props take time to get ready so return null when uid not avaialble
    if (email === null) {
      return null;
    }

    return ( 
      <div>
        <RegisterForm 
          email={email}
        />
      </div>
    );
  }
}

export default RegisterPage;