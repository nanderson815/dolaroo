import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MaskedInput from 'react-text-mask';
import NumberFormat from 'react-number-format';
import locatStyles from './Register.module.css';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
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

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={ref => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}

TextMaskCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
};

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            className={locatStyles.input}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            prefix="$"
        />
    );
}

NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};



class Register extends React.Component {
    state = {
        firstName: "",
        lastName: "",
        company: "",
        revenue: "",
        locations: "",
        cash: ""
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };


    render() {
        const { classes } = this.props;

        return (
            <div className="container">
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">Register Now</span>

                        <h5>About You</h5>
                        <form className={classes.container} noValidate autoComplete="off">
                            
                            <TextField
                                id="firstName"
                                label="First Name"
                                placeholder="John"
                                multiline
                                className={classes.textField}
                                margin="normal"
                                value={this.state.firstName}
                                onChange={this.handleChange('firstName')}
                            />

                            <TextField
                                id="lastName"
                                label="Last Name"
                                placeholder="Doe"
                                multiline
                                className={classes.textField}
                                margin="normal"
                                value={this.state.lastName}
                                onChange={this.handleChange('lastName')}
                            />



                            <TextField
                                id="email"
                                label="Email"
                                placeholder="JohnDoe@gmail.com"
                                multiline
                                className={classes.textField}
                                type="email"
                                name="email"
                                autoComplete="email"
                                margin="normal"
                            />

                            <TextField
                                id="confirmEmail"
                                label="Confirm Email"
                                placeholder="JohnDoe@gmail.com"
                                multiline
                                className={classes.textField}
                                type="email"
                                name="email"
                                autoComplete="email"
                                margin="normal"
                            />
                        </form>
                        <br></br>
                        <h5>About Your Business</h5>
                        <form className={classes.container} noValidate autoComplete="off">
                            <TextField
                                id="companyName"
                                label="Company Name"
                                placeholder="Company Inc."
                                multiline
                                className={classes.textField}
                                margin="normal"
                                value={this.state.company}
                                onChange={this.handleChange('company')}
                            />

                            <TextField
                                id="revenue"
                                label="Revenue"
                                // placeholder="$1,000,000"
                                multiline
                                className={classes.textField}
                                margin="normal"
                                value={this.state.revenue}
                                onChange={this.handleChange('revenue')}
                                InputProps={{
                                    inputComponent: NumberFormatCustom,
                                }}
                            />


                            <FormControl margin="normal" className={classes.formControl}>
                                <InputLabel htmlFor="locations-helper">Number of Locations</InputLabel>
                                <Select
                                    value={this.state.locations}
                                    onChange={this.handleChange('locations')}
                                    input={<Input name="locations" id="locations-helper" />}

                                >
                                    <MenuItem value={"One"}>One</MenuItem>
                                    <MenuItem value={"Two - Ten"}>Two - Ten</MenuItem>
                                    <MenuItem value={"Ten+"}>Ten+</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl margin="normal" className={classes.formControl}>
                                <InputLabel htmlFor="cash-helper">Percentage of Cash Transactions</InputLabel>
                                <Select
                                    value={this.state.cash}
                                    onChange={this.handleChange('cash')}
                                    input={<Input name="cash" id="cash-helper" />}

                                >
                                    <MenuItem value={"<10%"}> Less than 10% </MenuItem>
                                    <MenuItem value={"10 -20"}>10% - 20% </MenuItem>
                                    <MenuItem value={"20 -30"}>21% - 30% </MenuItem>
                                    <MenuItem value={"30 - 40"}>31% - 40% </MenuItem>
                                    <MenuItem value={"40 - 50"}>41% - 50% </MenuItem>
                                    <MenuItem value={">50%"}>Greater than 50% </MenuItem>

                                </Select>
                            </FormControl>
                        </form>



                    </div>
                </div >
            </div>
        );
    }
}

Register.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Register);