import React from 'react';
import Plot from 'react-plotly.js';
import _ from "underscore";
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';

import { withAuthUserContext } from "../../Auth/Session/AuthUserContext";


class DepositsByStatus extends React.Component {
    plotDeposits = () => {

        let combiedData = this.props.deposits.concat(this.props.depositsArchive);

        // Filter data for current month.
        let currentDeposits = combiedData.filter(deposit => {
            let depositMonth = new Date(deposit.time.seconds * 1000).getMonth() + 1
            let currentMonth = new Date().getMonth() + 1
            return currentMonth === depositMonth
        });

        console.log(combiedData);
        console.log(currentDeposits);

        // Get totals for each status option.

        let submittedDeposits = combiedData.filter(dep => dep.status === "submitted");
        let submitted = Object.keys(submittedDeposits).reduce((previous, key) => {
            return previous + submittedDeposits[key].amount
        }, 0);

        let pendingDeposits = combiedData.filter(dep => dep.statue === "pending");
        let pending = Object.keys(pendingDeposits).reduce((previous, key) => {
            return previous + pendingDeposits[key].amount
        }, 0);

        let settledDeposits = combiedData.filter(dep => dep.status === "settled");
        let settled = Object.keys(settledDeposits).reduce((previous, key) => {
            return previous + settledDeposits[key].amount
        }, 0);


        // const formattedAmounts = amounts.map(amount => "$" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));


        return (
            <Plot
                data={[
                    {
                        type: 'bar',
                        name: 'Deposits by Status',
                        x: ["submitted", "pending", "settled"],
                        y: [submitted, pending, settled],
                        marker: { color: 'rgb(13, 71, 161)' },
                        "hoverinfo": "text",
                        "line": { "width": 2.5 },
                        text: [submitted, pending, settled],
                    },
                ]}
                layout={
                    {
                        autosize: true,
                        /* title: 'Deposits By User' */
                        xaxis: {
                            autorange: true,
                        },
                        yaxis: {
                            tickprefix: "$",
                            separatethousands: true
                        },
                        margin: {
                            l: 60,
                            r: 20,
                            b: 20,
                            t: 10,
                        }
                    }
                }
                useResizeHandler={true}
                style={{ width: "100%", height: "100%" }}
                config={{ displayModeBar: false }}
            />
        );
    }


    // go to details
    viewDetails = () => {
        this.props.history.push({
            pathname: '/depositlist'
        });
    }

    render() {
        // Some props take time to get ready so return null when uid not avaialble
        if (!this.props.user) {
            return null;
        }

        if (this.props.user.authUser) {
            return (
                <div>
                    <div className="col s12 l6">
                        <div className="card">
                            <div className="card-content pCard">
                                <span className="card-title">{this.props.title ? this.props.title : 'DepositByDay'}</span>
                                {this.plotDeposits()}
                            </div>
                            <div className="card-action pCard">
                                <div className="center-align">
                                    <button onClick={this.viewDetails} className="waves-effect waves-light dash-btn blue darken-4 btn">More Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <Redirect to="/signin" />
            );
        }
    }
}

export default withRouter(withAuthUserContext(DepositsByStatus));