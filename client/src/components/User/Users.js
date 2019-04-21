import React from 'react';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';


import { withAuthUserContext } from "../Auth/Session/AuthUserContext";
import User from './User';
import UserAPI from "./UserAPI";

class Users extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [
            ],
            message: ""
        };
    }

    refreshPage = () => {
        // Get with security
        UserAPI.getUsers()
        .then(users => {
            for (let i in users) {
                users[i].firstName = users[i].firstName || "First";
                users[i].lastName = users[i].lastName || "Last";
                users[i].claims = users[i].claims || "user"; 
            }

            // console.log(`Users in refresh page: ${JSON.stringify(users, null, 2)}`);
            this.setState({ users: users });
        })
        .catch(err => {
            console.error(err); 
        });        
    };

    // Scrape all the users on mount
    componentDidMount() {
        this.refreshPage();
    }

    // Delete this article from MongoDB
    userDelete = (id) => {
        UserAPI.delete( id )
        .then(res => {
            console.log("Deleted user");
            this.refreshPage();
        })
        .catch(err => {
            alert(err);
            console.error(err); 
        });
    }

    // Make Admin
    userMakeAdmin = (id) => {

        console.log(`Trying to make User ${id} Admin`);

        UserAPI.makeAdmin( id )
        .then(res => {
            console.log(`Made User ${id} Admin`);
            this.refreshPage();
        })
        .catch(err => {
            alert(err);
            console.error(err); 
        });
    }        
    
    // Make Cashier
    userMakeCashier = (id) => {

        console.log(`Trying to make User ${id} Cashier`);

        UserAPI.makeCashier( id )
        .then(res => {
            console.log(`Made User ${id} Cashier`);
            this.refreshPage();
        })
        .catch(err => {
            alert(err);
            console.error(err); 
        });
    }   

    // Make User - essentailly dispables the user
    userMakeUser = (id) => {
        console.log(`Trying to make User ${id} User`);

        UserAPI.makeUser( id )
        .then(res => {
            console.log(`Made User ${id} User`);
            this.refreshPage();
        })
        .catch(err => {
            alert(err);
            console.error(err); 
        });
    }       

    // Make Banker
    userMakeBanker = (id) => {
        console.log(`Trying to make User ${id} Banker`);

        UserAPI.makeBanker( id )
        .then(res => {
            console.log(`Made User ${id} Banker`);
            this.refreshPage();
        })
        .catch(err => {
            alert(err);
            console.error(err); 
        });
    }       
    
    // go back to where you came from
    goBack = () => {
        this.props.history.goBack();
    }

    render() {
        if (this.props.user.authUser && this.props.user.isAdmin) {
            return (
                <div className="row">
                {this.state.users.map((user) => {
                    return(            
                        <div key={user.id} className="col s12 m6 l6">
                            <User 
                            userDelete={this.userDelete}
                            userMakeAdmin={this.userMakeAdmin}
                            userMakeCashier={this.userMakeCashier}
                            userMakeBanker={this.userMakeBanker}
                            userMakeUser={this.userMakeUser}
                            userInfo={user}
                            />
                        </div>
                        );
                })}
                </div>
            );
        } else if (this.props.user.authUser) {                
            return (
                <Redirect to="/dashboard" />
            );  
        } else  {                
            return (
                <Redirect to="/signin" />
            );      
        }
    }
}

export default withRouter(withAuthUserContext(Users));