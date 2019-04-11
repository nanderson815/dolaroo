import React, { Component } from 'react';
import DepositDB from '../Dashboard/Deposit/DepositDB';



class Payment extends Component {
    state = {
        credit: 0,
        minimum: 25,
        other: 0
    }

    componentDidMount() {

        DepositDB.get("credit")
            .then(res => this.setState({ credit: res[0].balance }));

    }


    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col s12">
                            <div className="card">
                                <div className="card-content">
                                    <span className="card-title"><h4>Make a payment</h4></span>

                                    <form action="#!">
                                        <p>
                                            <label>
                                                <input className="with-gap" name="group1" type="radio" value={this.state.credit} />
                                                <span>Current Balance: ${this.state.credit}</span>
                                            </label>
                                        </p>
                                        <p>
                                            <label>
                                                <input className="with-gap" name="group1" type="radio" value={this.state.minimum} />
                                                <span>Minimum Payment: ${this.state.minimum}</span>
                                            </label>
                                        </p>
                                        <p>
                                            <label>
                                                <input className="with-gap" name="group1" type="radio" />
                                                <span> Other: ${this.state.other} 
                                                    <span className="input-field">
                                                        <input id="last_name" type="text" className="validate" value={this.state.other}/>
                                                    </span>
                                                </span>
                                            </label>
                                        </p>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}


export default Payment;