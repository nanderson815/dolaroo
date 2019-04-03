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
                <main>
                    <div className="container">
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
                                <a className="btn white blue-text text-darken-4">Learn More</a>
                            </div>
                        </div>
                    </div>

                </main>
            </div >
        );
    }
}

export default Landing;