import React from 'react';
import { Redirect } from 'react-router';

import Prospects from "./Prospects";
import DepositsArchive from "./DepositsArchive";
import { withAuthUserContext } from "../Auth/Session/AuthUserContext";

import DepositsArchiveDB from "./DepositsArchiveDB";

class Banker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showProspects: true,
            showDeposits: false,
            depositsArchive: [],
            message: ""
            };
    }

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

    getAll = () => {
        // take money out of safe
        DepositsArchiveDB.getAll().then(depositsArray => {
            this.setState({
                showProspects: false,
                showDeposits: true,
                depositsArchive: [...depositsArray]
            });    
        }).catch(err => {
            console.error(`Error getting deposits ${err}`);
            this.setState({
                message: `Error getting deposits ${err}`
            });

        });
    }
  
    showProspects = () => {
        // take money out of safe
        this.setState({
            showProspects: true,
            showDeposits: false
        });
    }
  
    render() {
        if (this.props.user && this.props.user.isBanker) {
            return ( 
                <div className="container">
                    <div className="row center-align">
                        <br />
                        <button className="btn center-align blue darken-4" onClick={this.showProspects}>Display Prospects</button>{" "}
                        <br />
                        <button className="btn center-align blue darken-4" onClick={this.clearSafeDeposits}>Send Cash to Bank</button>{" "}
                        <button className="btn center-align blue darken-4" onClick={this.reverseSafeDeposits}>Undo Cash Transaction</button>{" "}
                        <br />
                        <button className="btn center-align blue darken-4" onClick={this.getAll}>Show All</button>{" "}
                        <button className="btn center-align blue darken-4" onClick={this.getAwaiting}>Awaiting Settlement</button>{" "}
                    </div>
                    {this.state.showProspects ? <h5 className="center-align">Prospects</h5> : null}
                    {this.state.showProspects ? <Prospects /> : null}
                    {this.state.showDeposits ? <h5 className="center-align">Deposits Archive</h5> : null}
                    {this.state.showDeposits ? <DepositsArchive depositsArchive={this.state.depositsArchive}/> : null}
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