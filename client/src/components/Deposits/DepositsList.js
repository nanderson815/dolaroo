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
        DepositDB.get("deposits")
        .then(deposits => {
            const sortedByDate = deposits.sort((a, b) => {
                return  (new Date(a.time) < new Date(b.time)) ? 1 : -1;
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
        // Some props take time to get ready so return null when uid not avaialble
        if (this.props.user.uid === null) {
            return null;
        }
        
        if (this.props.user.authUser) {
            return (
                <div className="container">
                    <ul className="collection">
                    {this.state.deposits.map((deposit) => {
                        return(            
                            <div key={deposit.id}>
                                <DepositItem deposit={deposit}
                                />
                            </div>
                        );
                    })}
                    </ul>
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