import React from 'react';
import ProvisionalCredit from './ProvisionalCredit/provisionalCredit';
import Deposit from './Deposit/Deposit';
import Balance from './Balance/Balance';
import './dashboard.css';

class Home extends React.Component {

    render() {
        return (
            <div>
                <div className="headerCard blue darken-4"></div>
                <div className="container">
                    <div className="row">
                        <ProvisionalCredit />
                        <Balance />
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;