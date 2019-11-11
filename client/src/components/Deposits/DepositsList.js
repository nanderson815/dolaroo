import React from 'react';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import CircularProgress from '@material-ui/core/CircularProgress';


import { withAuthUserContext } from "../Auth/Session/AuthUserContext";
import DepositItem from './DepositItem';
import Util from '../Util/Util';

import { withStyles } from '@material-ui/core/styles';

// export csv functionality
// eslint-disable-next-line no-unused-vars
import { CSVLink, CSVDownload } from "react-csv";

let db = Util.getFirestoreDB()

const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    progress: {
        margin: theme.spacing.unit * 2,
    },
});

class DepositList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deposits: [],
            depositsArchive: [],
            loadingFlag: false,
            fetchedData: false
        };
    }


    // get all on mount
    componentDidMount() {
        this._mounted = true;
        this.setState({
            loadingFlag: true
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.user !== prevProps.user || this.state.fetchedData === false) {

            if (this.props.user.company) {
                // Get all deposits from this company only on load
                console.log("i ran")
                let company = this.props.user.company ? this.props.user.company : null;
                let location = this.props.user.location;

                this.listener1 = db.collection(company).doc(location).collection("deposits").onSnapshot((querySnapshot) => {
                    let deposits = [];
                    querySnapshot.forEach(doc => {
                        let deposit = {};
                        deposit = doc.data();
                        deposit.id = doc.id;
                        deposit.time = deposit.time.toDate();
                        deposits.push(deposit);
                    });
                    if (this._mounted === true) {
                        this.setState({
                            deposits
                        })
                    }
                }, (err) => console.log(err));

                // Get all archived deposits on load
                this.listener2 = db.collection(company).doc(location).collection("depositsarchive").onSnapshot((querySnapshot) => {
                    let depositsArchive = [];
                    querySnapshot.forEach(doc => {
                        let deposit = {};
                        deposit = doc.data();
                        deposit.id = doc.id;
                        deposit.time = deposit.time.toDate();
                        depositsArchive.push(deposit);
                    });

                    if (this._mounted) {
                        this.setState({ depositsArchive, loadingFlag: false, fetchedData: true })
                    }
                }, (err) => console.log(err));
            }

        }
    }

    render() {
        const { classes } = this.props;

        // Some props take time to get ready so return null when uid not avaialble
        // if (this.props.user.uid === null) {
        //     return null;
        // }

        let csvData = this.state.deposits.concat(this.state.depositsArchive);
        let cleanedData = csvData.map(({ correlationId, link, uid, id, settlementLink, ...keepers }) => keepers)

        if (this.props.user.authUser) {
            return (
                <div className="container">
                    <br></br>
                    <CSVLink
                        data={cleanedData}
                        filename={'dollaroo-transactions.csv'}
                        className='btn blue darken-4'
                        target="_blank"
                    >EXPORT TO CSV</CSVLink>
                    <div className={classes.root}>
                        <div className="row">
                            <h5 className="col s6 m3 offset-m1">Time</h5>
                            <h5 className="col s6 m3">User</h5>
                            <h5 className="col s12 m2 offset-m3">Amount</h5>
                        </div>
                        {this.state.loadingFlag ? <div> <CircularProgress className={classes.progress} /> <p>Loading ...</p> </div> : null}
                        {this.state.deposits.concat(this.state.depositsArchive).map((deposit) => {
                            return (
                                <div key={deposit.id}>
                                    <DepositItem deposit={deposit}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        } else {
            return (
                <Redirect to="/dashboard" />
            );
        }
    }
}


export default withRouter(withAuthUserContext(withStyles(styles)(DepositList)));