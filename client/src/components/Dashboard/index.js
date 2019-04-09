import React from 'react';
import ProvisionalCredit from './ProvisionalCredit/provisionalCredit';
import Deposit from './Deposit/Deposit';
import Balance from './Balance/Balance';
import GraphCard from './GraphCard/GraphCard';
import './dashboard.css';

import DepositDB from './Deposit/DepositDB';

class Home extends React.Component {
    state = {
        deposits: [],
        credit: 0,
        cash: 0
    }

    componentDidMount(){
        DepositDB.get()
        .then(res => this.setState({deposits: res}));

    }

    render() {
        return (
            <div>
                <div className="headerCard blue darken-4"></div>
                <div className="container">
                    <div className="row">
                        <ProvisionalCredit credit={this.state.credit} />
                        <Balance balance={this.state.cash}/>
                    </div>
                    <div className="row">
                        <GraphCard />
                        <GraphCard />
                        <GraphCard />
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;