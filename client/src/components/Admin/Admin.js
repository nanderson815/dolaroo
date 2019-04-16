import React from 'react';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';

import Users from "../User/Users"
import { withAuthUserContext } from "../Auth/Session/AuthUserContext";

class Admin extends React.Component {
  
    // route to new use create
    createUser = () => {
        this.props.history.push({
            pathname: '/userform'
        });
    }

    // go back to where you came from
    goBack = () => {
        this.props.history.goBack();
    }

    render() {
        if (this.props.user.authUser && this.props.user.claims === "admin") {
            return ( 
                <div className="container">
                    <div className="row center-align">
                        <br />
                        <button className="btn center-align" onClick={this.createUser}>Create User</button>
                    </div>
                    <Users />
                </div>
            );
        } else if (this.props.user.authUser) {                
            return (
                <Redirect to="/dashboard" />
            );  
        } else  {                
            return (
                <Redirect to="/signin" />
            );      
        }
    }
}

export default withRouter(withAuthUserContext(Admin));