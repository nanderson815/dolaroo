import React from 'react';
import ProvisionalCredit from './ProvisionalCredit/provisionalCredit';
// import Deposit from './Deposit/Deposit';
import Balance from './Balance/Balance';
import GraphCard from './GraphCard/GraphCard';
import './dashboard.css';
import { withAuthUserContext } from '../Auth/Session/AuthUserContext';
// import { withFirebaseContext } from '../Auth/Firebase/FirebaseContext';

import DepositDB from './Deposit/DepositDB';

class Home extends React.Component {
    state = {
        deposits: [],
        credit: 0,
        cash: 0
    }

    componentDidMount() {
        console.log(this.props.user.authUser);
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
                            <GraphCard />
                            <GraphCard />
                            <GraphCard />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <h1>Please Sign in to view this page.</h1>
            )
        }

    }
}

export default withAuthUserContext(Home);