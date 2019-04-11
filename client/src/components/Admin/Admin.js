import React from 'react';
import Users from "../User/Users"
import { withRouter } from 'react-router-dom';
  
class Admin extends React.Component {
  
    // route to new use create
    createUser = () => {
        this.props.history.push({
            pathname: '/userform'
        });
    }

    render() {
        return ( 
            <div className="container">
                <div class="row center-align">
                    <br />
                    <button className="btn center-align" onClick={this.createUser}>Create User</button>
                </div>
                <Users />
          </div>
          );
    }
}

export default withRouter(Admin);