import React from 'react';
import { Redirect } from 'react-router';

import Prospects from "./Prospects";
import { withAuthUserContext } from "../Auth/Session/AuthUserContext";

import DepositsArchiveDB from "./DepositsArchiveDB";

class Banker extends React.Component {

    clearSafeDeposits = () => {
        // take money out of safe
        DepositsArchiveDB.clearAwaitingSettlement().then(res => {
            alert(res);
        }).catch(err => {
            console.error(`clearSafeDeposits Error: ${err}`);
        });
    }

    reverseSafeDeposits = () => {
        // take money out of safe
        DepositsArchiveDB.reverseAwaitingSettlement().then(res => {
            alert(res);
        }).catch(err => {
            console.error(`clearSafeDeposits Error: ${err}`);
        });
    }
  
    render() {
        if (this.props.user && this.props.user.isBanker) {
            return ( 
                <div className="container">
                    <div className="row center-align">
                        <br />
                        <button className="btn center-align blue darken-4" onClick={this.clearSafeDeposits}>Send Cash to Bank</button>{" "}
                        <button className="btn center-align blue darken-4" onClick={this.reverseSafeDeposits}>Undo Cash Transaction</button>{" "}
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