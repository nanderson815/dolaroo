import React from 'react';
import './Balance.css'


const Balance = (props) => {
    return (
        <div>
            <div className="col s12 l4">
                <div className="card">
                    <div className="card-content pCard">
                        <span className="card-title">Cash Balance</span>
                        <h1 className="displayDebit">${props.balance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h1>
                    </div>
                    <div className="card-action pCard">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Balance;