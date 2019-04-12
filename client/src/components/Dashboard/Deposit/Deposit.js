import React from 'react';
import Util from '../../Util/Util';
import M from "materialize-css/dist/js/materialize.min.js";
import Modal from './DepositModal';
import { withAuthUserContext } from '../../Auth/Session/AuthUserContext';
import DepositDB from '../Deposit/DepositDB';
import { Redirect } from 'react-router';


class Deposit extends React.Component {
    state = {
        cash: 0,
        credit: 0,
        amount: 0
    }

    componentDidMount() {
        DepositDB.get("credit")
            .then(res => this.setState({ credit: res[0].balance }));
        DepositDB.get("cash")
            .then(res => this.setState({ cash: res[0].balance }))
        let elem = document.querySelector(".modal");
        M.Modal.init(elem);
    }

    onChangeHandler = (event) => {
        let amount = event.target.value;
        this.setState({ amount });
    }



    onSubmitHandler = (event) => {
        event.preventDefault();
        const db = Util.getFirestoreDB();

        let d = Date(Date.now());
        let amount = parseFloat(this.state.amount);

        db.collection('deposits').add({
            amount: amount,
            time: d.toString(),
            user: this.props.user.authUser.email,
            UID: this.props.user.authUser.uid
        });


        db.collection('cash').doc('balance').update({
            balance: this.state.cash + amount
        });

        db.collection('credit').doc('balance').update({
            balance: this.state.credit + (.975 * amount)
        });


    }


    render() {
        if (this.props.user.authUser) {
            return (
                <div className="container">
                    <Modal />
                    <div className="col s12">
                        <div className="card">
                            <div className="card-content pCard">
                                <span className="card-title">New Deposit</span>
                                <div className="row">
                                    <form className="col s12">
                                        <p>Note: This input will be replaced by a hardware component in deployment.</p>
                                        <div className="input-field col s12 m6">
                                            <input id="amount" type="number" onChange={this.onChangeHandler} value={this.state.amount ? this.state.amount : ""} className="validate" />
                                            <label htmlFor="amount">Deposit Amount</label>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="card-action pCard">
                                <div className="center-align ">
                                    <button className="btn waves-effect waves-light modal-trigger"
                                        type="submit" href="#modal1" onClick={this.onSubmitHandler} name="action">Submit
                                        </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <Redirect to="/" />
            )
        }

    }

};

export default withAuthUserContext(Deposit);