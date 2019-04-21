import React from 'react';
import Plot from 'react-plotly.js';
import styles from './Savings.module.css';


const Savings = (props) => {

    console.log(props);

    const oldCost = props.cash * .15;
    const ourCost = props.cash - props.credit;
    const savings = oldCost - ourCost

    console.log(savings);

    return (
        <div>
            <div className="col s12 l6">
                <div className="card">
                    <div className="card-content pCard savingsCard">
                        <span className="card-title">Savings</span>
                        <div className={`${styles.wrapper}`}>
                            <div className="plotly">
                                <Plot
                                    data={[
                                        {
                                            // Sort: False ensures that the chart does not order descending.  
                                            sort: false,
                                            values: [50, 25 / 2, 75 / 2],
                                            rotation: 90,
                                            text: ['', '', ``],
                                            textinfo: 'text',
                                            textposition: 'inside',
                                            textfont: {
                                                size: 18,
                                                color: 'white'
                                            },
                                            marker: {
                                                colors: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)', 'green'],
                                                line: {
                                                    color: ['rgba(255, 255, 255, 0)', 'rgb(220, 220, 220, 0)', 'rgba(220, 220, 220, 1)'],
                                                    width: 1
                                                },
                                            },
                                            hole: .5,
                                            type: 'pie',
                                            showlegend: false,

                                        }
                                    ]}
                                    layout={
                                        {
                                            autosize: true,
                                            hovermode: false,
                                            xaxis: {
                                                zeroline: false, showticklabels: false,
                                                showgrid: false, range: [-1, 1]
                                            },
                                            yaxis: {
                                                zeroline: false, showticklabels: false,
                                                showgrid: false, range: [-1, 1]
                                            },
                                            paper_bgcolor: 'rgba(0,0,0,0)',
                                            plot_bgcolor: 'rgba(0,0,0,0)'
                                        }
                                    }
                                    useResizeHandler={true}
                                    style={{ width: "100%", height: "100%" }}
                                    config={{ displayModeBar: false }}
                                />
                                <h5 className={`center-align ${styles.overlay}`}>{`$${savings.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</h5>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Savings;