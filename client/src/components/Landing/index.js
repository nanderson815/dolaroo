import React from 'react';
import './Landing.css';

class Landing extends React.Component {

    render() {
        return (
            <div>
                <header>
                    <div className="container">
                        <div className="row">
                            <div className="col s5 offset-s7">
                                <h3 className="white-text">How Retailers Handle Cash</h3>
                                <h5 className="white-text">Instantly make cash deposits</h5>
                            </div>
                        </div>
                    </div>
                </header>
            </div >
        );
    }
}

export default Landing;