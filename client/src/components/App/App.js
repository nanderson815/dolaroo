import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Navigation from '../Navigation/Navigation';
import LandingPage from '../Landing';
import HomePage from '../Dashboard';
import AccountPage from '../Account/Account';
import Payment from '../Payment/Payment';
import Deposit from '../Dashboard/Deposit/Deposit';


// Auth components
import SignUpForm from '../Auth/SignUp/SignUp';
import SignInForm from '../Auth/SignIn/SignIn';
import PasswordForgetPage from '../Auth/PasswordForget/PasswordForget';

// Session/State Info for all components
import provideAuthUserContext from '../Auth/Session/provideAuthUserContext';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Navigation />
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/signup" component={SignUpForm} />
          <Route exact path="/signin" component={SignInForm} />
          <Route exact path="/pw-forget" component={PasswordForgetPage} />
          <Route exact path="/dashboard" component={HomePage} />
          <Route exact path="/account" component={AccountPage} />
          <Route exact path="/dashboard/payment" component={Payment} />
          <Route exact path="/dashboard/deposit" component={Deposit} />
        </div>
      </Router>
    );
  }
}

export default provideAuthUserContext(App);