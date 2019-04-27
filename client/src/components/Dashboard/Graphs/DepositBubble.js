import React from 'react';
import Plot from 'react-plotly.js';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';


import { withAuthUserContext } from "../../Auth/Session/AuthUserContext";

class DepositByAll extends React.Component {

    alertData = (data) => {
        // var pts = '';
        // for (var i = 0; i & lt; data.points.length; i++) {
        //     pts = 'x = ' + data.points[i].x + '\ny = ' +
        //         data.points[i].y.toPrecision(4) + '\n\n';
        // }
        // alert('Closest point clicked:\n\n' + pts);
        console.log(data);
    }

    plotDeposits = () => {
        const selectorOptions = {
            buttons: [
                {
                    step: 'day',
                    stepmode: 'backward',
                    count: 7,
                    label: '1w'
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



        let combiedData = this.props.deposits.concat(this.props.depositsArchive);

        let xData = combiedData.map(deposit => deposit.time.toDate());

        let yData = combiedData.map(deposit => {
            let bills = 0;
            bills = deposit.ones + deposit.fives + deposit.tens + deposit.twenties + deposit.fifties + deposit.hundreds;
            return bills;
        });

        let size = combiedData.map(deposit => deposit.amount);

        let hover = size.map(amount => "$" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

        let groups = combiedData.map(deposit => deposit.email);
        let onlyUnique = (value, index, self) => {
            return self.indexOf(value) === index;
        }
        let Ugroups = groups.filter(onlyUnique);
        console.log(Ugroups);



        return (
            <Plot
                data={[
                    {
                        type: 'scatter',
                        mode: 'markers',
                        x: xData,
                        y: yData,
                        text: hover,
                        "hoverinfo": "text",
                        marker: {
                            size: size,
                            sizemode: "area",
                            sizeref: .7
                        },
                        transforms: [{
                            type: 'groupby',
                            groups: groups,
                        }]
                    }]}
                layout={
                    {
                        autosize: true,
                        xaxis: {
                            autorange: true,
                            rangeselector: selectorOptions,
                        },
                        showlegend: true,
                        margin: {
                            l: 50,
                            r: 50,
                            b: 30,
                            t: 10,
                        },
                        // yaxis: {
                        //     tickprefix: "$",
                        //     separatethousands: true
                        // }
                    }
                }
                useResizeHandler={true}
                style={{ width: "100%", height: "100%" }}
                config={{ displayModeBar: false }}
                onClick={('plotly_click', function (data) {
                    console.log(data);
                    var pts = 'Amount: ' + data.points[0].text + '\nDate: ' + data.points[0].x
                    alert('Closest point clicked:\n\n' + pts);
                })}
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
                    <div className="col s12 l12">
                        <div className="card">
                            <div className="card-content pCard">
                                <span className="card-title">{this.props.title ? this.props.title : 'DepositByAll'}</span>
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

export default withRouter(withAuthUserContext(DepositByAll));