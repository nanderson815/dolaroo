import React from 'react';
import AuthUserContext from './AuthUserContext';

class Session extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return ( 
            <div>
                <h1>Session</h1>
            </div>  
        );
    }
}

export default Session;
export { AuthUserContext };