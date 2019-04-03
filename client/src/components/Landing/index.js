import React from 'react';
import './Landing.css';

class Landing extends React.Component {

    render() {
        return (
            <div>
                <header>
                    <div className="container">
                        <div className="row">
                            <div className="textbox col m5 offset-m7">
                                <h3 className="white-text">How Retailers Handle Cash</h3>
                                <h5 className="white-text">Instantly make cash deposits</h5>
                                <h5 className="white-text">Consolidate balances from multiple locations</h5>
                                <h5 className="white-text">View comprehensive deposit reports</h5>
                                <h5 className="white-text">All from your phone or tablet</h5>

                                <div className="center-align">
                                    <a className="waves-effect waves-light btn  blue darken-4">Sign Up Now</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </div >
        );
    }
}

export default Landing;