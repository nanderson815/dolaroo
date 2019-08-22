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
import Util from '../Util/Util';

let db = Util.getFirestoreDB()
let company = "testCompany"

class Home extends React.Component {
    state = {
        deposits: [],
        credit: 0,
        pendingCredit: 0,
        cash: 0,
        depositsArchive: [],
        cashHistory: [],
        creditHistory: [],
        loadingFlag: false,
    }


    componentDidMount() {
        this._mounted = true;
        this.setState({
            loadingFlag: true
        })

        // Get all deposits from this company only on load
        db.collectionGroup("deposits").where("company", "==", company).onSnapshot((querySnapshot) => {
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
        db.collectionGroup("depositsarchive").where("company", "==", company).onSnapshot((querySnapshot) => {
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
                this.setState({ depositsArchive, pendingCredit, loadingFlag: false })
            }
        }, (err) => console.log(err));
    }

    componentWillUnmount() {
        this._mounted = false;
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