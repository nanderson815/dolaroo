import React from 'react';
import { Redirect } from 'react-router';
import { withAuthUserContext } from "../Auth/Session/AuthUserContext";

import Prospects from "./Prospects";
import DepositsArchive from "./DepositsArchive";
import SafeDeposits from "./SafeDeposits/SafeDeposits";
import AwaitingSettlement from "./AwaitingSettlement/AwaitingSettlement";
import SettledDeposits from "./SettledDeposits/SettledDeposits";

import DepositsArchiveDB from "./DepositsArchiveDB";

class Banker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showProspects: true,
            showDeposits: false,
            depositsArchive: [],
            balanceInSafe: 0,
            balanceAwaitingSettlement: 0,
            balanceSettledDeposits: 0,
            message: ""
            };
    }

    // takle money out of the safe and onto truck or walk to bank
    sendDepositsToBank = () => {
        // take money out of safe
        DepositsArchiveDB.sendDepositsToBank().then(res => {
            this.refreshTotals();
        }).catch(err => {
            console.error(`sendDepositsToBank Error: ${err}`);
        });
    }

    // settle deposits transported to bank
    settleDeposits = () => {
        // take money out of safe
        DepositsArchiveDB.settleDeposits(this.props.user).then(settledAmount => {
            this.refreshTotals();
        }).catch(err => {
            console.error(`settleDeposits Error: ${err}`);
        });
    }

    reverseSafeDeposits = () => {
        // take money out of safe
        DepositsArchiveDB.reverseAwaitingSettlement().then(res => {
            this.refreshTotals();
        }).catch(err => {
            console.error(`sendDepositsToBank Error: ${err}`);
        });
    }

    generateDepositTestData = () => {
        // take money out of safe
        DepositsArchiveDB.generateDepositsTestData().then(res => {
            this.refreshTotals();
        }).catch(err => {
            console.error(`generateDepositTestData Error: ${err}`);
        });
    }

    fixDepositTable = () => {
        // take money out of safe
        DepositsArchiveDB.fixDepositTable().then(res => {
            alert(res);
        }).catch(err => {
            console.error(`fixDepositTable Error: ${err}`);
        });
    }

    getInSafeTotal = () => {
        // take money out of safe
        DepositsArchiveDB.getInSafeTotal().then(total => {
            this.setState({
                balanceInSafe: total,
            });    
        }).catch(err => {
            console.error(`Error getInSafeTotal ${err}`);
            this.setState({
                message: `Error in getInSafeTotal ${err}`
            });

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
  
    getAwaitingSettlement = () => {
        // take money out of safe
        DepositsArchiveDB.getAwaitingSettlement().then(depositsArray => {
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

    getAwaitingTotal = () => {
        // take money out of safe
        DepositsArchiveDB.getAwaitingTotal().then(total => {
            this.setState({
                balanceAwaitingSettlement: total,
            });    
        }).catch(err => {
            console.error(`Error getAwaitingTotal ${err}`);
            this.setState({
                message: `Error in getAwaitingTotal ${err}`
            });
        });
    }
  
    getSettledDeposits = () => {
        // take money out of safe
        DepositsArchiveDB.getSettledDeposits().then(depositsArray => {
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

    getSettledTotal = () => {
        // take money out of safe
        DepositsArchiveDB.getSettledTotal().then(total => {
            this.setState({
                balanceSettledDeposits: total,
            });    
        }).catch(err => {
            console.error(`Error getAwaitingTotal ${err}`);
            this.setState({
                message: `Error in getAwaitingTotal ${err}`
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

    // refresh when totals change
    refreshTotals() {
        this.getInSafeTotal();
        this.getAwaitingTotal();
        this.getSettledTotal();
    }
    // Get totals
    componentDidMount() {
        this.refreshTotals();
    }
    
    render() {
        if (this.props.user && this.props.user.isBanker) {
            return ( 
                <div className="container">
                    {this.state.message ? <div className="row">{this.state.messae}</div>: null}
                    <div className="row">
                        <SafeDeposits disabled={this.props.user.isBanker ? false : true}
                            balance={this.state.balanceInSafe}
                            sendDepositsToBank={this.sendDepositsToBank}
                            reverseSafeDeposits={this.reverseSafeDeposits}
                            generateDepositTestData={this.generateDepositTestData}
                         />
                        <AwaitingSettlement disabled={this.props.user.isBanker ? false : true}
                            balance={this.state.balanceAwaitingSettlement}
                            settleDeposits={this.settleDeposits}
                            getAwaitingSettlement={this.getAwaitingSettlement}
                         />
                        <SettledDeposits disabled={this.props.user.isBanker ? false : true}
                            balance={this.state.balanceSettledDeposits}
                            getSettledDeposits={this.getSettledDeposits}
                         />
                    </div>

                    <div className="row center-align">
                        {/*
                            <br />
                        <button className="btn center-align blue darken-4" onClick={this.fixDepositTable}>Fix Deposits Table</button>{" "}
                        */}
                        <br />
                        <button className="btn center-align blue darken-4" onClick={this.showProspects}>Display Prospects</button>{" "}
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