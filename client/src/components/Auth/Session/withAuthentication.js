import React from 'react';

import AuthUserContext from './AuthUserContext';
import { withFirebase } from '../Firebase/FirebaseContext';

// This component WRAPS Firebase and Authentication Context togtehr in 
// a HOC - Higher Order Component.
// This allows providers to just wrap withAuthentication around a component
// to get access to the firebase app and the session context info
// SO BE CLEAR - This HOC is a WRAPPER in A WRAPPER
// -- i.e. withAuthentication === withFirebase(WithAuthentication)
const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                authUser: null,
            };
        }

        // NOTE:  This is where the AuthUserContext gets SET
        // I set it here it can be accessed anywhere below since context shared at top
        // Also the the the firebase app object is passed from the index.js component
        // above the app component so it can be used here.  
        componentDidMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    authUser ? this.setState({ authUser}) : this.setState({authUser: null});
                },
            );
        }

        // This deletes listener to clean things up and prevent mem leaks
        componentWillUnmount() {
            this.listener();
        }

        // Remember - this withAuthentication pattern automatically wraps a compoennt
        // with the provider show below to keep it out of that component
        // it provides the state of this a-object to ant consumer
        // I am not 100% sure its cleaner and easier but I will go with it for now.
        render() {
            return ( 
                <AuthUserContext.Provider value = {this.state.authUser} >
                    <Component {...this.props} /> 
                </AuthUserContext.Provider>
            );
        }
    }

    return withFirebase(WithAuthentication);
};

export default withAuthentication;