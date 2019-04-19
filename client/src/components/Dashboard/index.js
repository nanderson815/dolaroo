import React from 'react';
import ProvisionalCredit from './ProvisionalCredit/provisionalCredit';
// import Deposit from './Deposit/Deposit';
import Balance from './Balance/Balance';
import './dashboard.css';
import { withAuthUserContext } from '../Auth/Session/AuthUserContext';
import { Redirect } from 'react-router';
// import { withFirebaseContext } from '../Auth/Firebase/FirebaseContext';

import DepositByUser from "./Graphs/DepositByUser";
import DepositByDay from "./Graphs/DepositByDay";
import DepositByAll from "./Graphs/DepositByAll";
import DepositByDenomination from "./Graphs/DepositByDenomination";

import DepositDB from './Deposit/DepositDB';

class Home extends React.Component {
    state = {
        deposits: [],
        credit: 0,
        cash: 0
    }

    componentDidMount() {
        DepositDB.get("deposits")
            .then(res => this.setState({ deposits: res }));
        DepositDB.get("credit")
            .then(res => this.setState({ credit: res[0].balance }));
        DepositDB.get("cash")
            .then(res => this.setState({ cash: res[0].balance }));
        // this.props.firebase.db.get("")
    }

    render() {

        if (this.props.user.authUser) {
            return (
                <div>
                    <div className="container">
                        <div className="row">
                            <ProvisionalCredit credit={this.state.credit} />
                            <Balance balance={this.state.cash} />
                        </div>
                        <div className="row">
                            <DepositByDay 
                                title={"Total Deposits By Day"}
                                deposits={this.state.deposits}
                            />
                            <DepositByUser 
                                title={"Deposits By User"}
                                deposits={this.state.deposits}
                            />
                            <DepositByAll 
                                title={"All Deposits"}
                                deposits={this.state.deposits}
                            />
                            <DepositByDenomination 
                                title={"Number of Bills By Denomination"}     
                                deposits={this.state.deposits}
                            />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <Redirect to="/" />
            );
        }

    }
}

export default withAuthUserContext(Home);