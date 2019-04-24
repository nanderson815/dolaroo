import React from 'react';
import { Redirect } from 'react-router';

import Prospects from "./Prospects";
import { withAuthUserContext } from "../Auth/Session/AuthUserContext";

import SettledDepositsDB from "./SettledDepositsDB";

class Banker extends React.Component {

    updateDeposits = () => {
        // Add the proper boolean to the depoists table for all docs
        SettledDepositsDB.setDepositsToCurrent().then(res => {
            alert(res);
        }).catch(err => {
            console.error(`error updating ${err}`);
        });
    }
  
    render() {
        if (this.props.user && this.props.user.isBanker) {
            return ( 
                <div className="container">
                    <div className="row center-align">
                        <br />
                        <button className="btn center-align blue darken-4" onClick={this.updateDeposits}>Batch Update Deposits</button>{" "}
                    </div>
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