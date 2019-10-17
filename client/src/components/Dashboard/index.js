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
import DepositsByStatus from './Graphs/DepositsByStatus';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Util from '../Util/Util';

let db = Util.getFirestoreDB()

class Home extends React.Component {
    state = {
        deposits: [],
        credit: 0,
        pendingCredit: 0,
        cash: 0,
        depositsArchive: [],
        loadingFlag: false,
        fetchedData: false,
    }


    componentDidMount() {
        this._mounted = true;
        if (this.state.deposits.length === 0) {
            this.setState({
                loadingFlag: true
            })
        }
    }

    componentDidUpdate(prevProps) {

        // Allows a super admin to input what company/location he wants to see.
        if (this.props.user.isSuperAdmin !== prevProps.user.isSuperAdmin && this.props.user.isSuperAdmin === true) {
            let company = prompt("Enter the company name.");
            let location = prompt("Enter the location name.")
            this.setState({ company, location })
        }

        // sets up the listener to grab data in real time, only if the user is new.
        if (this.props.user !== prevProps.user || this.state.fetchedData === false) {

            if (this.props.user.company || this.state.company) {
                let company = this.props.user.company ? this.props.user.company : this.state.company;
                let location = this.props.user.location ? this.props.user.location : this.state.location;

                // Get all deposits from this company only on load for one location. TODO: Add all locations
                this.listener1 = db.collection(company).doc(location).collection("deposits").onSnapshot((querySnapshot) => {
                    let deposits = [];
                    let cash = 0;
                    let credit = 0;
                    querySnapshot.forEach(doc => {
                        let deposit = {};
                        deposit = doc.data();
                        deposit.id = doc.id;
                        deposit.time = deposit.time.toDate();
                        deposits.push(deposit);
                        cash += deposit.amount
                        credit += deposit.paidAmount ? deposit.paidAmount : 0
                    });
                    if (this._mounted === true) {
                        this.setState({
                            cash, credit, deposits
                        })
                    }
                }, (err) => console.log(err));

                // Get all archived deposits on load
                this.listener2 = db.collection(company).doc(location).collection("depositsarchive").onSnapshot((querySnapshot) => {
                    let depositsArchive = [];
                    let pendingCredit = 0;
                    querySnapshot.forEach(doc => {
                        let deposit = {};
                        deposit = doc.data();
                        deposit.id = doc.id;
                        deposit.time = deposit.time.toDate();
                        depositsArchive.push(deposit);
                    });

                    depositsArchive.forEach(tran => pendingCredit += tran.amount);

                    if (this._mounted) {
                        this.setState({ depositsArchive, pendingCredit, loadingFlag: false, fetchedData: true })
                    }
                }, (err) => console.log(err));
            }

        }
    }

    componentWillUnmount() {
        this._mounted = false;
        if (this.listener1) {
            this.listener1();
            this.listener2();
        }
    }

    toggleModal() {
        let status = !this.state.modalOpen
        this.setState({ modalOpen: status })
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
                                <Balance balance={this.state.cash} disabled={true} />
                                <Savings credit={this.state.credit} />
                            </div>
                            <div className="row">
                                <DepositByDay
                                    title={"Total Deposits By Day"}
                                    deposits={this.state.deposits}
                                    depositsArchive={this.state.depositsArchive}
                                    toggle={this.toggleModal}
                                />

                                <DepositByUser
                                    title={"Deposits By User"}
                                    deposits={this.state.deposits}
                                    depositsArchive={this.state.depositsArchive}
                                />

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


                                {/* Replace with deposits by location. */}
                                {/* <ProvisionalCreditOverTime
                                    title={"Provisional Credit Over Time"}
                                    deposits={this.state.deposits}
                                    depositsArchive={this.state.depositsArchive}
                                /> */}

                                <DepositsByStatus
                                    title={"Deposits by Status (Current Month)"}
                                    deposits={this.state.deposits}
                                    depositsArchive={this.state.depositsArchive}
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