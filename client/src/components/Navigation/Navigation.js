import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import M from "materialize-css/dist/js/materialize.min.js";
import SignOutButton from '../Auth/SignOut/SignOut';
import AuthUserContext from '../Auth/Session/AuthUserContext';

class Navigation extends React.Component {
  constructor(props) {
      super(props);

      this.navBarClass = '';

      if (props.scroll){
          this.navBarClass = 'transparent z-depth-0';
      } else {
          this.navBarClass = 'z-depth-0 blue darken-4'
      }
  }

  componentDidMount() {
    let elem = document.querySelector(".sidenav");
    M.Sidenav.init(elem, {
        edge: "left",
        inDuration: 250
    });
  }

  render() {
    const navigationAuth = 
      <ul>
        <li><Link to="/">Landing</Link></li>
        <li><NavLink to="/home">Home</NavLink></li>
        <li><NavLink to="/account">Account</NavLink></li>
        <li><SignOutButton /></li>
      </ul>
      ;

    const navigationNonAuth = 
      <ul>
        <li><Link to="/">Landing</Link></li>
        <li><NavLink to="/signin">Signin</NavLink></li>
      </ul>
    ;

    const mobileNavigationAuth = 
      <ul>
        <li><a href="/">Landing</a></li>
        <li><a href="/home">Home</a></li>
        <li><a href="/account">Account</a></li>
        <li><SignOutButton /></li>
      </ul>
      ;

    const mobileNavigationNonAuth = 
      <ul>
        <li><a href="/">Landing</a></li>
        <li><a href="/signin">Signin</a></li>
      </ul>
    ;

    // get auth user from react-context firebase
    // Not the AuthUSerContext Provider passes the authUser
    // in its value={} paramater (see withAuthentication component in Auth/Session)
    // ANY COMPONENT that needs authUser info uses consumer this way
      
    return (
      <div>
        <ul className="sidenav" id="mobile-menu">
          <AuthUserContext.Consumer>
            {authUser =>
              authUser ? mobileNavigationAuth : mobileNavigationNonAuth
            }
          </AuthUserContext.Consumer>
        </ul>

        <div className='navbar-fixed'>
            <nav className={this.navBarClass}>
                <div className="container nav-wrapper">
                    <a href="#!" data-target="mobile-menu" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                    <ul className="right hide-on-med-and-down">
                      <AuthUserContext.Consumer>
                        {authUser =>
                          authUser ? navigationAuth : navigationNonAuth
                        }
                      </AuthUserContext.Consumer>
                    </ul>
                </div>
            </nav>
        </div>
      </div>
    );
  }// render
} //class

export default Navigation;