import React from 'react';
import './Balance.css'


const Balance =(props) => {
    return (
        <div>
            <div className="col s12 l6">
                <div className="card">
                    <div className="card-content pCard">
                        <span className="card-title">Cash Balance</span>
                        <h1 className="displayDebit">${props.balance}</h1>
                    </div>
                    <div className="card-action pCard">
                        <div className="center-align ">
                            <a href="!#" className="waves-effect waves-light dash-btn blue darken-4 btn">New Deposit</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Balance;