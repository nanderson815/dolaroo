import React, { Component } from 'react';
import DepositDB from '../Dashboard/Deposit/DepositDB';



class Payment extends Component {
    state = {
        credit: 0,
        minimum: 25,
        other: ""
    }

    componentDidMount() {
        DepositDB.get("credit")
            .then(res => this.setState({ credit: res[0].balance }));
    }

    onChangeHandler = event => {
        let value = event.target.value;
        this.setState({ other: value });
        console.log(value)
    }

    onSubmitHandler = event => {
        event.preventDefault()
        let radios = document.getElementsByName('group1');
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {   
                console.log(radios[i].value);
                break;
            }
        }
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
                                                <input className="with-gap" name="group1" type="radio" value={this.state.other}/>
                                                <span> Other: ${this.state.other}
                                                    <span className="input-field">
                                                        <input id="otherVal" type="number" className="validate" onChange={this.onChangeHandler} value={this.state.other} />
                                                    </span>
                                                </span>
                                            </label>
                                        </p>
                                        <br></br>
                                        <button className="btn waves-effect waves-light" type="submit" onClick={this.onSubmitHandler} name="action">Submit
                                        </button>
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