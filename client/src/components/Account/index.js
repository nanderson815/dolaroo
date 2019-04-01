import React from 'react';

class Account extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            message: ''
        };
    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const {
            firstName,
            lastName,
            email,
            message,
        } = this.state;

        const isInvalid =
            firstName !== "" ||
            lastName === "" ||
            email === "" ||
            message === "";

        return ( 
            <div>
                <h1>Account</h1>
            </div>  
        );
    }
}

export default Account;