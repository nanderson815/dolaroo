import React from 'react';
import Plot from 'react-plotly.js';
import { Redirect } from 'react-router';

import { withAuthUserContext } from "../../Auth/Session/AuthUserContext";

class DepositByUser extends React.Component {
    convertDate = (str) => {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth()+1)).slice(-2),
            day  = ("0" + date.getDate()).slice(-2);
        return [ date.getFullYear(), mnth, day ].join("-");
    }    
    
    plotDeposits = () => {
        const selectorOptions = {
            buttons: [{
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
            return  (a.time > b.time) ? 1 : -1;
        });
        // convert to javascript date object so plotly can recognize it as a proper date
        const times = sortedByDate.map((deposit) => {
            let jsDate = new Date(deposit.time);
            return (jsDate);
        });

        const earliestDate = times.length > 0 ? times[0] : new Date();
        const latestDate = times.length > 0 ? times[times.length-1] : new Date();
        console.log(`early: ${earliestDate}, late ${latestDate}`);

        const amounts = sortedByDate.map((deposit) => {
            return (deposit.amount); 
        });

        //const today = date();

        return (
            <Plot
            data= {[
                {
                    type: 'scatter',
                    mode: 'lines+points',
                    name: 'Deposits By User',
                    x: times,
                    y: amounts,
                    marker: {color: 'red'}
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
                        rangeslider: {},
                        /*type: 'date'*/
                      }          
                }
            }
            useResizeHandler = {true}
            style = {{width: "100%", height: "100%"}}
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
                    <div className="col s12 m6">
                        <div className="card">
                            <div className="card-content pCard">
                                <span className="card-title">{this.props.title ? this.props.title : 'Card Title'}</span>
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
        } else  {                
            return (
                <Redirect to="/signin" />
            );      
        }
    }
}

export default withAuthUserContext(DepositByUser);