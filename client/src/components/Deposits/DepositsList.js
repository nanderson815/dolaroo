import React from 'react';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';


import { withAuthUserContext } from "../Auth/Session/AuthUserContext";
import DepositItem from './DepositItem';
import DepositDB from "../Dashboard/Deposit/DepositDB";

import { withStyles } from '@material-ui/core/styles';

// export csv functionality
import { CSVLink, CSVDownload } from "react-csv";


const styles = theme => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
});  

class DepositList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            deposits: [
            ]
        };
    }

    getDeposits = () => {
        // Get with security
        DepositDB.get("deposits")
        .then(deposits => {
            // const uid = deposits.uid;
            // UserAPI.get(uid).then (user => {
            //     if (user.displayName) {
            //         deposit.displayName = docUser.data().displayName;
            //     }
            // }).catch (err => {
            //     // push even if uid not found
            //     deposits.push(deposit); 
            // });

            let sortedByDate = deposits.sort((a, b) => {
                return  (a.time < b.time) ? 1 : -1;
            });

            sortedByDate = sortedByDate.map(deposit => {
                deposit.time = deposit.time.toDate();
                return(deposit);
            });
    
            this.setState({ deposits: sortedByDate });
        })
        .catch(err => {
            console.error(err); 
        });        
    };

    // get all on mount
    componentDidMount() {
        this.getDeposits();
    }

    

    render() {
        const {classes} = this.props;

        const csvData = [
        ["firstname", "lastname", "email"],
        ["Ahmed", "Tomi", "ah@smthing.co.com"],
        ["Raed", "Labes", "rl@smthing.co.com"],
        ["Yezzi", "Min l3b", "ymin@cocococo.com"]
    ];

        // Some props take time to get ready so return null when uid not avaialble
        if (this.props.user.uid === null) {
            return null;
        }
        
        if (this.props.user.authUser) {
            return (
                <div className="container">
                <div className='containter'>
                        <button>
                            <CSVLink data={csvData}>Download me</CSVLink>
                        </button>
                </div>
                    <div className={classes.root}>
                        <div className="row">
                            <h5 className="col s6 m3 offset-m1">Time</h5>
                            <h5 className="col s6 m3">User</h5>
                            <h5 className="col s12 m2 offset-m3">Amount</h5>
                        </div>
                        {this.state.deposits.map((deposit) => {
                        return(            
                            <div key={deposit.id}>
                                <DepositItem deposit={deposit}
                                />
                            </div>
                        );
                        })}
                    </div>
                </div>
            );
        } else  {                
            return (
                <Redirect to="/signin" />
            );      
        }
    }
}

  
export default withRouter(withAuthUserContext(withStyles(styles)(DepositList)));