import React from 'react';
import Plot from 'react-plotly.js';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';

import { withAuthUserContext } from "../../Auth/Session/AuthUserContext";

class DepositByUser extends React.Component {
    plotDeposits = (uid) => {
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
    
        const filteredByUid = this.props.deposits.filter((deposit) => {
            return  deposit.uid === uid;
        });

        const sortedByDate = filteredByUid.sort((a, b) => {
            return  (a.time > b.time) ? 1 : -1;
        });
        // convert to javascript date object so plotly can recognize it as a proper date
        const times = sortedByDate.map((deposit) => {
            let jsDate = new Date(deposit.time);
            return (jsDate);
        });

        const earliestDate = times.length > 0 ? times[0] : new Date();
        const latestDate = times.length > 0 ? times[times.length-1] : new Date();

        const amounts = sortedByDate.map((deposit) => {
            return (deposit.amount); 
        });

        return (
            <Plot
            data= {[
                {
                    type: 'bar',
                    mode: 'stack',
                    name: 'Deposits by User',
                    x: times,
                    y: amounts,
                    marker: {color: 'blue'},
                    "hoverinfo": "x+y",
                    "line": {"width": 0.5}, 
                },
            ]}
            layout = {
                {
                    autosize: true,
                    /* title: 'Deposits By User' */
                    xaxis: {
                        autorange: true,
                        range: [earliestDate, latestDate],
                        rangeselector: selectorOptions,
                        rangeslider: {earliestDate, latestDate},
                      }          
                }
            }
            useResizeHandler = {true}
            style = {{width: "100%", height: "100%"}}
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

        const displayName = this.props.user.displayName;
  
        if (this.props.user.authUser) {
            return ( 
                <div>
                    <div className="col s12 m6">
                        <div className="card">
                            <div className="card-content pCard">
                            <span className="card-title">{this.props.title ? this.props.title : 'DepositByUser'} : {displayName}</span>
                            {this.plotDeposits(this.props.user.authUser.uid)}
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
        } else  {                
            return (
                <Redirect to="/signin" />
            );      
        }
    }
}

export default withRouter(withAuthUserContext(DepositByUser));