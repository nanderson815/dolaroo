import React from 'react';
import './Landing.css';
import { Redirect } from 'react-router-dom';

class Landing extends React.Component {

    render() {
        if (this.props.user) {
            return (
                <Redirect to="/dashboard" />
            )
        } else {
            return (
                <Redirect to="/signin" />
            );
        }
    }
}

export default Landing;