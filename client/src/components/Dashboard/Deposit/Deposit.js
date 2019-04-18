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
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300,
    }
});


function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            other={other}
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
        amount: 0,
        ones: 0,
        fives: 0,
        tens: 0,
        twenties: 0,
        fifties: 0,
        hundreds: 0,
    }

    componentDidMount() {
        DepositDB.get("credit")
            .then(res => this.setState({ credit: res[0].balance }));
        DepositDB.get("cash")
            .then(res => this.setState({ cash: res[0].balance }))
        let elem = document.querySelector(".modal");
        M.Modal.init(elem);
    }


    handleChange = name => event => {
        if (event.target.value) {
            this.setState({ [name]: parseInt(event.target.value) });
        }
        else {
            this.setState({ [name]: 0 });
        }
    };

    updateDatabase = () => {
        const db = Util.getFirestoreDB();

        let amount =this.state.amount

        db.collection('deposits').add({
            amount: amount,
            ones: this.state.ones,
            fives: this.state.fives,
            tens: this.state.tens,
            twenties: this.state.twenties,
            fifties: this.state.fifties,
            hundreds: this.state.hundreds,
            time: new Date(),
            email: this.props.user.authUser.email,
            uid: this.props.user.authUser.uid
        });

        db.collection('cash').doc('balance').update({
            balance: this.state.cash + amount
        });

        db.collection('credit').doc('balance').update({
            balance: this.state.credit + (.975 * amount)
        });
    }



    onSubmitHandler = (event) => {
        event.preventDefault();

        const total = (this.state.ones) + (this.state.fives * 5) + (this.state.tens * 10) + (this.state.twenties * 20) + (this.state.fifties * 50) + (this.state.hundreds * 100);

        this.setState({amount: total}, this.updateDatabase);
        
    }


    render() {
        const { classes } = this.props;
        if (this.props.user.authUser) {
            return (
                <div className="container">
                    <Modal amount={this.state.amount} />
                    <div className="col s12">
                        <div className="card">
                            <div className="card-content pCard">
                                <span className="card-title">New Deposit</span>
                                <div className="row">
                                    <div className="col s12">
                                        <p>Note: This input will be replaced by a hardware component in deployment. For now, enter the number of each bill denomination to be deposited</p>

                                        <form className={classes.container} noValidate autoComplete="off">

                                            <TextField
                                                id="ones"
                                                label="$1 Bills"
                                                multiline
                                                denomination={1}
                                                className={classes.textField}
                                                margin="normal"
                                                value={this.state.ones ? this.state.ones : ""}
                                                onChange={this.handleChange('ones')}
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
                                                value={this.state.fives ? this.state.fives : ""}
                                                onChange={this.handleChange('fives')}
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
                                                value={this.state.tens ? this.state.tens : ""}
                                                onChange={this.handleChange('tens')}
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                }}
                                            />


                                            <TextField
                                                id="twenties"
                                                label="$20 Bills"
                                                multiline
                                                className={classes.textField}
                                                margin="normal"
                                                value={this.state.twenties ? this.state.twenties : ""}
                                                onChange={this.handleChange('twenties')}
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom,
                                                }}
                                            />

                                            <TextField
                                                id="fifties"
                                                label="$50 Bills"
                                                multiline
                                                className={classes.textField}
                                                margin="normal"
                                                value={this.state.fifties ? this.state.fifties : ""}
                                                onChange={this.handleChange('fifties')}
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
                                                value={this.state.hundreds ? this.state.hundreds : ""}
                                                onChange={this.handleChange('hundreds')}
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