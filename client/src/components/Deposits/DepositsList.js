import React from 'react';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';


import { withAuthUserContext } from "../Auth/Session/AuthUserContext";
import DepositItem from './DepositItem';
import DepositDB from "../Dashboard/Deposit/DepositDB";

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
        DepositDB.getByDate()
        .then(deposits => {
            this.setState({ deposits: deposits });
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
        // Some props take time to get ready so return null when uid not avaialble
        if (this.props.user.uid === null) {
            return null;
        }
        
        if (this.props.user.authUser) {
            return (
                <div className="container">
                {this.state.deposits.map((deposit) => {
                    return(            
                        <div key={deposit.id}>
                            <DepositItem deposit={deposit}
                            />
                        </div>
                    );
                })}
                </div>
            );
        } else  {                
            return (
                <Redirect to="/signin" />
            );      
        }
    }
}

export default withRouter(withAuthUserContext(DepositList));