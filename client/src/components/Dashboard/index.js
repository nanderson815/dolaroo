import React from 'react';
import ProvisionalCredit from './ProvisionalCredit/provisionalCredit';
import Balance from './Balance/Balance';
import Savings from './Savings/Savings';
import './dashboard.css';
import { withAuthUserContext } from '../Auth/Session/AuthUserContext';
import { Redirect } from 'react-router';
import DepositByUser from "./Graphs/DepositByUser";
import DepositByDay from "./Graphs/DepositByDay";
import DepositBubble from "./Graphs/DepositBubble";
import DepositByDenomination from "./Graphs/DepositByDenomination";
import ProvisionalCreditOverTime from "./Graphs/ProvisionalCreditOverTime"
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import axios from 'axios'

class Home extends React.Component {
    state = {
        deposits: [],
        credit: 0,
        cash: 0,
        depositsArchive: [],
        cashHistory: [],
        creditHistory: [],
        loadingFlag: false
    }

    componentDidMount() {
        this._mounted = true;
        this.setState({ loadingFlag: true })

        axios.get("/api/firestore/deposits")
            .then(res => {
                console.log(res.data);
                if (this._mounted) {
                    this.setState({ deposits: res.data })
                }
            })
            .catch(err => console.error(err));


        axios.get("/api/firestore/cash")
            .then(res => {
                if (this._mounted) {
                    this.setState({ cashHistory: res.data })
                }
            })
            .catch(err => console.error(err));

        axios.get("/api/firestore/credit")
            .then(res => {
                if (this._mounted) {
                    this.setState({ creditHistory: res.data })
                }
            })
            .catch(err => console.error(err));

        axios.get("/api/firestore/getSafeDeposits")
            .then(res => {
                if (this._mounted) {
                    this.setState({
                        cash: res.data,
                        credit: res.data * .975
                    })
                }
            })
            .catch(err => console.error(err));

        axios.get("/api/firestore/getPendingTotal")
            .then(res => {
                if (this._mounted) {
                    this.setState({
                        credit: this.state.credit + (res.data * .975)
                    })
                }
            })
            .catch(err => console.error(err));

        axios.get("/api/firestore/depositsArchive")
            .then(res => {
                if (this._mounted) {
                    this.setState({ depositsArchive: res.data, loadingFlag: false })
                }
            })
            .catch(err => console.error(err));


    }

    componentWillUnmount() {
        this._mounted = false;
    }


    render() {
        if (this.props.user.authUser) {
            return (
                <div>
                    {this.state.loadingFlag ?
                        <Grid container justify="center">
                            <CircularProgress /> <p>Loading ...</p>
                        </Grid>

                        :

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
                    }
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