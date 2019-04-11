import React from 'react';
import Util from '../../Util/Util';
import M from "materialize-css/dist/js/materialize.min.js";
import Modal from './DepositModal';
import { withAuthUserContext } from '../../Auth/Session/AuthUserContext';


class Deposit extends React.Component {
    state = {
        amount: 0
    }

    componentDidMount() {
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
    }


    render() {
        let message = this.props.user.authUser ? this.props.user.authUser : null
        console.log(message);
        return (
            <div className="container">
                <Modal />
                <div className="col s12 m2">
                    <div className="card">
                        <div className="card-content pCard">
                            <span className="card-title">New Deposit</span>
                            <div className="row">
                                <form className="col s12">
                                    <p>Note: This input will be replaced by a hardware component in deployment.</p>
                                    <div className="input-field col s6">
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
    }

};

export default withAuthUserContext(Deposit);