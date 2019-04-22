import React from 'react';
import { Redirect } from 'react-router';

import Prospects from "./Prospects";
import { withAuthUserContext } from "../Auth/Session/AuthUserContext";

class Banker extends React.Component {
  
    render() {
        if (this.props.user && this.props.user.isBanker) {
            return ( 
                <div className="container">
                    <h5 className="center-align">Prospects</h5>
                    <Prospects />
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

export default withAuthUserContext(Banker);