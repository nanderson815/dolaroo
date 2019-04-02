import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Navigation from '../Navigation/Navigation';
import LandingPage from '../Landing';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

// Auth components
import SignUpPage from '../Auth/SignUp/SignUp';
import SignInPage from '../Auth/SignIn/SignIn';
import PasswordForgetPage from '../Auth/PasswordForget/PasswordForget';

// Session/State Info for all components
import withAuthentication from '../Auth/Session/withAuthentication';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
    };
  }

  render() {
    return (
        <Router>
          <div>
            <Navigation />
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/signup" component={SignUpPage} />
            <Route exact path="/signin" component={SignInPage} />
            <Route exact path="/pw-forget" component={PasswordForgetPage} />
            <Route exact path="/home" component={HomePage} />
            <Route exact path="/account" component={AccountPage} />
            <Route exact path="/admin" component={AdminPage} />
          </div>
        </Router>
    );
  }
}

export default withAuthentication(App);