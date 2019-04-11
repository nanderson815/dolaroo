import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import M from "materialize-css/dist/js/materialize.min.js";
import SignOutButton from '../Auth/SignOut/SignOut';
import { withAuthUserContext } from '../Auth/Session/AuthUserContext';
import { withRouter } from 'react-router-dom';
import AccountAvatar from "../Account/AccountAvatar"

class Navigation extends React.Component {
  state = {
    isTop: true
  }

  componentDidMount() {
    let elem = document.querySelector(".sidenav");
    M.Sidenav.init(elem, {
      edge: "left",
      inDuration: 250
    });

    document.addEventListener('scroll', () => {
      const isTop = window.scrollY < 100;
      if (isTop !== this.state.isTop) {
        // console.log(isTop);
        this.setState({ isTop })
      }
    });
  }

  render() {

    let navBarClass = '';

    if (this.state.isTop && this.props.history.location.pathname === "/") {
      navBarClass = 'transparent z-depth-0';
    } else {
      navBarClass = 'z-depth-0 blue darken-4'
    }


    const navigationAdminMobile =
      <ul>
        <li><a href="/">Landing</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/account">Account</a></li>
        <li><a href="/admin">Admin</a></li>
        <li><SignOutButton /></li>
      </ul>
      ;

    const navigationAdmin =
      <ul>
        <li><Link to="/">Landing</Link></li>
        <li><NavLink to="/dashboard">Home</NavLink></li>
        <li><NavLink to="/account"><AccountAvatar /></NavLink></li>
        <li><NavLink to="/admin">Admin</NavLink></li>
        <li><SignOutButton /></li>
      </ul>
      ;

    const navigationAuthMobile =
      <ul>
        <li><a href="/">Landing</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><SignOutButton /></li>
      </ul>
      ;

    const navigationAuth =
      <ul>
        <li><Link to="/">Landing</Link></li>
        <li><NavLink to="/dashboard">Home</NavLink></li>
        <li><SignOutButton /></li>
      </ul>
      ;

    const navigationNonAuthMobile =
      <ul>
        <li><a href="/">Landing</a></li>
        <li><a href="/signin">Signin</a></li>
      </ul>
      ;


    const navigationNonAuth =
      <ul>
        <li><Link to="/">Landing</Link></li>
        <li><NavLink to="/signin">Signin</NavLink></li>
      </ul>
      ;



    // get auth user from react-context firebase
    // Not the AuthUSerContext Provider passes the authUser
    // in its value={} paramater (see withAuthentication component in Auth/Session)
    // ANY COMPONENT that needs authUser info uses consumer this way

    let navBar, navBarMobile
    if (this.props.user.authUser && this.props.user.claims === "admin") {
      navBar = navigationAdmin;
      navBarMobile = navigationAdminMobile
    } else if (this.props.user.authUser) {
      navBar = navigationAuth;
      navBarMobile = navigationAuthMobile;
    } else {
      navBar = navigationNonAuth;
      navBarMobile = navigationNonAuthMobile;
    }

    return (
      <div>
        <ul className="sidenav" id="mobile-menu">
            {navBarMobile}
        </ul>

        <div className='navbar-fixed'>
          <nav className={navBarClass}>
            <div className="container nav-wrapper">
              <a href="#!" className="brand-logo center">Dollaroo</a>
              <a href="#!" data-target="mobile-menu" className="sidenav-trigger"><i className="material-icons">menu</i></a>
              <ul className="right hide-on-med-and-down">
                {navBar}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    );
  }// render
} //class

export default withAuthUserContext(withRouter(Navigation));