import React from 'react';
import Plot from 'react-plotly.js';
import { Redirect } from 'react-router';

import { withAuthUserContext } from "../../Auth/Session/AuthUserContext";

class DepositByAll extends React.Component {
    plotDeposits = () => {
        const selectorOptions = {
            buttons: [
                {
                    step: 'day',
                    stepmode: 'backward',
                    count: 1,
                    label: '1d'
                }, {
                    step: 'month',
                    stepmode: 'backward',
                    count: 1,
                    label: '1m'
                }, {
                    step: 'month',
                    stepmode: 'backward',
                    count: 6,
                    label: '6m'
                }, {
                    step: 'year',
                    stepmode: 'todate',
                    count: 1,
                    label: 'YTD'
                }, {
                    step: 'year',
                    stepmode: 'backward',
                    count: 1,
                    label: '1y'
                }, {
                    step: 'all',
                }]
        };

        const sortedByDate = this.props.deposits.sort((a, b) => {
            return (a.time > b.time) ? 1 : -1;
        });

        // No Need to convert now that the deposit data is fixed. 
        const times = sortedByDate.map((deposit) => {
            return (deposit.time.toDate());
        });

        const earliestDate = times.length > 0 ? times[0] : new Date();
        const latestDate = times.length > 0 ? times[times.length - 1] : new Date();

        const amounts = sortedByDate.map((deposit) => {
            return (deposit.amount);
        });
        console.log(this.props.deposits)

        return (
            <Plot
                data={[
                    {
                        "hoverinfo": "x+y",
                        "line": { "width": 0.5 },
                        "marker": { "size": 8, color: 'rgb(13, 71, 161)' },
                        type: 'scatter',
                        mode: 'lines+markers',
                        name: 'Deposits By User',
                        x: times,
                        y: amounts,
                    },
                ]}
                layout={
                    {
                        autosize: true,
                        xaxis: {
                            autorange: true,
                            range: [earliestDate, latestDate],
                            rangeselector: selectorOptions,
                            rangeslider: { earliestDate, latestDate },
                        }
                    }
                }
                useResizeHandler={true}
                style={{ width: "100%", height: "100%" }}
                config={{ displayModeBar: false }}

            />
        );
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
                                <span className="card-title">{this.props.title ? this.props.title : 'DepositByAll'}</span>
                                {this.plotDeposits()}
                            </div>
                            <div className="card-action pCard">
                                <div className="center-align">
                                    <a href="#!" className="waves-effect waves-light dash-btn blue darken-4 btn">More Details</a>
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

export default withAuthUserContext(DepositByAll);