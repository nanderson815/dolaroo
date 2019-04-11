import React from 'react';
import './provisionalCredit.css';
import { Link, Route } from 'react-router-dom';

const ProvisionalCredit = (props) => {

    return (
        <div>
            <div className="col s12 l6">
                <div className="card">
                    <div className="card-content pCard">
                        <span className="card-title">Provisional Credit</span>
                        <h1 className="displayCredit">${props.credit}</h1>
                    </div>
                    <div className="card-action pCard">
                        <div className="center-align">
                            <Link to="dashboard/payment" className="waves-effect waves-light dash-btn blue darken-4 btn">Pay Balance</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProvisionalCredit;