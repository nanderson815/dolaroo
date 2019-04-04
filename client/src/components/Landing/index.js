import React from 'react';
import './Landing.css';
import Circle from './Circle/circle';
import Step from './Steps/Steps';

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

                <main>
                    <div className="container main">
                        <div className='row'>
                            <div className="col s12">
                                <h3 className="white-text center-align">The days of making branch deposits are over</h3>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col s12 m8">
                                <h5 className="white-text">Depositing your business' hard-earned cash shouldn't be expensive or time consuming.
                                That's why we created a better way. </h5>
                            </div>
                            <div className="col s12 m3 offset-m1">
                                <div className="center-align">
                                    <a className="btn white blue-text text-darken-4">Learn More</a>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="cont">
                                <Circle info="Deposit cash remotely via Dollaroo's Smart Cash Scanner" />
                                <Circle info="Get instant credit to your account for daily deposits" />
                                <Circle info="View comprehensive deposit reports across all locations" />
                            </div>
                        </div>
                    </div>
                </main>

                <section>
                    <div className="container">
                        <div className='row'>
                            <div className="col s12">
                                <h3 className="blue-text text-darken-4 center-align">How depositing with Dollaroo works:</h3>
                                <div className="row">
                                    <Step num="1" step="Run your daily cash deposits through the Dollaroo Smart Scanner at the end of the day" />
                                    <Step num="2" step="Secure cash in any safe on site. Deposits are collected every two weeks, or on a custom schedule" />
                                    <Step num="3" step="Provisional credit is available the same day of deposit, consolidated from all locations" />

                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="signUp">
                    <div className="container">
                        <div className='row'>
                            <div className="col s12">
                                <h3 className="white-text center-align">Sign up today - Start depositing tomorrow</h3>
                                <div className="row">
                                    <div className="textbox col m5">
                                        <h5 className="white-text">Sign Up Requirements</h5>
                                        <p className="white-text">An in-person consultation and product demo are the first step of the sign up process. 
                                        Sign up today to be up and running in as little as two weeks.</p>
                                        <div className="center-align">
                                            <a className="waves-effect waves-light btn  blue darken-4">Sign Up Now</a>
                                            <a className="waves-effect waves-light btn  blue darken-4">More Info</a>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

            </div >
        );
    }
}

export default Landing;