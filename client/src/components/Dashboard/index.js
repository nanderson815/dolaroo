import React from 'react';
import ProvisionalCredit from './ProvisionalCredit/provisionalCredit';
import Balance from './Balance/Balance';
import Savings from './Savings/Savings';
import './dashboard.css';
import { withAuthUserContext } from '../Auth/Session/AuthUserContext';
import { Redirect } from 'react-router';
import DepositByUser from "./Graphs/DepositByUser";
import DepositByDay from "./Graphs/DepositByDay";
import DepositByAll from "./Graphs/DepositByAll";
import DepositBubble from "./Graphs/DepositBubble";
import DepositByDenomination from "./Graphs/DepositByDenomination";
import ProvisionalCreditOverTime from "./Graphs/ProvisionalCreditOverTime"

import DepositDB from './Deposit/DepositDB';

class Home extends React.Component {
    state = {
        deposits: [],
        credit: 0,
        cash: 0,
        depositsArchive: [],
        cashHistory: [],
        creditHistory: []
    }


    componentDidMount() {

        DepositDB.get("deposits")
            .then(res => this.setState({ deposits: res }))
            .catch(err => console.log("Please log in as a casheir or admin to unlock all features."));

        DepositDB.get("cash")
            .then(res => this.setState({ cashHistory: res }))
            .catch(err => console.log("Please log in as a casheir or admin to unlock all features."));

        DepositDB.get("credit")
            .then(res => this.setState({ creditHistory: res }))
            .catch(err => console.log("Please log in as a casheir or admin to unlock all features."));

        DepositDB.getInSafeTotal()
            .then(res => this.setState({
                cash: res,
                credit: res * .975
            }));

        DepositDB.getPendingTotal()
            .then(res => this.setState({
                // cash: this.state.cash + res,
                credit: this.state.credit + (res * .975)
            }));

        DepositDB.get("depositsarchive")
            .then(res => this.setState({ depositsArchive: res }))
            .catch(err => console.log("Please log in as a casheir or admin to unlock all features."));
    }


    render() {
        if (this.props.user.authUser) {
            return (
                <div>
                    <div className="container">
                        <div className="row">
                            <ProvisionalCredit credit={this.state.credit} />
                            <Balance balance={this.state.cash} disabled={this.props.user.isAdmin ? false : this.props.user.isCashier ? false : true} />
                            <Savings credit={this.state.credit} />
                        </div>
                        <div className="row">
                            <DepositByDay
                                title={"Total Deposits By Day"}
                                deposits={this.state.deposits}
                                depositsArchive={this.state.depositsArchive}
                            />

                            {this.props.user.isUser ? null :
                                <DepositByUser
                                    title={"Deposits By User"}
                                    deposits={this.state.deposits}
                                    depositsArchive={this.state.depositsArchive}
                                />}

                            
                            <DepositBubble
                                title={"All Deposits"}
                                deposits={this.state.deposits}
                                depositsArchive={this.state.depositsArchive}
                            />

                            <DepositByDenomination
                                title={"Number of Bills By Denomination"}
                                deposits={this.state.deposits}
                                depositsArchive={this.state.depositsArchive}
                            />

                            <ProvisionalCreditOverTime
                                title={"Provisional Credit Over Time"}
                                balance={this.state.creditHistory}
                            />


                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <Redirect to="/signin" />
            );
        }

    }
}

export default withAuthUserContext(Home);