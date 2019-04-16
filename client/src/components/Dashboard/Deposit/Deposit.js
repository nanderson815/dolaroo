import React from 'react';
import Util from '../../Util/Util';
import M from "materialize-css/dist/js/materialize.min.js";
import Modal from './DepositModal';
import { withAuthUserContext } from '../../Auth/Session/AuthUserContext';
import DepositDB from '../Deposit/DepositDB';
import { Redirect } from 'react-router';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    inputFix: {
        marginTop: 5
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300,
    },
    menu: {
        width: 200,
    },
    formControl: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        minWidth: 300,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});


function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            // className={locatStyles.input}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
        // prefix="$"
        />
    );
}


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
        const { classes } = this.props;
        if (this.props.user.authUser) {
            return (
                <div className="container">
                    <Modal />
                    <div className="col s12">
                        <div className="card">
                            <div className="card-content pCard">
                                <span className="card-title">New Deposit</span>
                                <div className="row">
                                    <div className="col s12">
                                        <p>Note: This input will be replaced by a hardware component in deployment.</p>

                                        <form className={classes.container} noValidate autoComplete="off">

                                            <TextField
                                                id="ones"
                                                label="$1 Bills"
                                                multiline
                                                className={classes.textField}
                                                margin="normal"
                                                value={this.state.amount ? this.state.amount : ""}
                                                onChange={this.onChangeHandler}
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                }}
                                            />

                                            <TextField
                                                id="fives"
                                                label="$5 Bills"
                                                multiline
                                                className={classes.textField}
                                                margin="normal"
                                                value={this.state.amount ? this.state.amount : ""}
                                                onChange={this.onChangeHandler}
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                }}
                                            />

                                            <TextField
                                                id="tens"
                                                label="$10 Bills"
                                                multiline
                                                margin="normal"
                                                className={classes.textField}
                                                value={this.state.amount ? this.state.amount : ""}
                                                onChange={this.onChangeHandler}
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                }}
                                            />


                                            <TextField
                                                id="twentys"
                                                label="$20 Bills"
                                                multiline
                                                className={classes.textField}
                                                margin="normal"
                                                value={this.state.amount ? this.state.amount : ""}
                                                onChange={this.onChangeHandler}
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                }}
                                            />


                                            <TextField
                                                id="hundreds"
                                                label="$100 Bills"
                                                multiline
                                                className={classes.textField}
                                                margin="normal"
                                                value={this.state.amount ? this.state.amount : ""}
                                                onChange={this.onChangeHandler}
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                }}
                                            />

                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="card-action pCard">
                                <div className="center-align ">
                                    <button className="btn waves-effect waves-light blue darken-4 modal-trigger"
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

export default withStyles(styles)(withAuthUserContext(Deposit));