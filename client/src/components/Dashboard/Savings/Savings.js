import React from 'react';
import Plot from 'react-plotly.js';


const Savings = (props) => {

    console.log(props);
    
    return (
        <div>
            <div className="col s12 l6">
                <div className="card">
                    <div className="card-content pCard savingsCard">
                        <span className="card-title">Savings</span>
                        <Plot
                            data={[
                                {
                                    values: [50 / 2, 50 / 2,  50],
                                    rotation: 90,
                                    text: [''],
                                    textinfo: 'text',
                                    textposition: 'inside',
                                    marker: {
                                        colors: ['rgba(255, 255, 255, 0)', 'rgba(110, 154, 22, .5)','rgba(255, 255, 255, 0)'],
                                        line: {
                                            color: ['rgb(220, 220, 220, 0)', 'rgba(220, 220, 220, 1)', 'rgba(255, 255, 255, 0)'],
                                            width: 1
                                        },
                                    },
                                    hoverinfo: 'label',
                                    hole: .5,
                                    type: 'pie',
                                    showlegend: false
                                }
                            ]}
                            layout={
                                {
                                    autosize: true,
                                    xaxis: {
                                        zeroline: false, showticklabels: false,
                                        showgrid: false, range: [-1, 1]
                                    },
                                    yaxis: {
                                        zeroline: false, showticklabels: false,
                                        showgrid: false, range: [-1, 1]
                                    }
                                }
                            }
                            useResizeHandler={true}
                            style={{ width: "100%", height: "100%" }}
                            config={{ displayModeBar: false }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Savings;