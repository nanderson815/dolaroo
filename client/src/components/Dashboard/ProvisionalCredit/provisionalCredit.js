import React from 'react';
import './provisionalCredit.css';

const ProvisionalCredit = (props) => {

    return (
        <div>
            <div className="col s12 m6">
                <div className="card">
                    <div className="card-content pCard">
                        <span className="card-title">Provisional Credit</span>
                        <h1 className="displayCredit">${props.credit}</h1>
                    </div>
                    <div className="card-action pCard">
                        <div className="center-align">
                            <a className="waves-effect waves-light dash-btn blue darken-4 btn">Pay Balance</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProvisionalCredit;