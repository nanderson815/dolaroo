import React from 'react';
import Users from "../User/Users"
  
class Admin extends React.Component {

    state = {};

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    componentDidMount() {
    }
  
    render() {

        return ( 
            <div className="container">
            <Users />
          </div>
          );
    }
}

export default Admin;