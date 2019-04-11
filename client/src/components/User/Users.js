import React from 'react';
import User from './User';
import UserAPI from "./UserAPI"

class Users extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [
            ]
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
    
    render() {
        return (
            <div className="row">
            {this.state.users.map((user) => {
                return(            
                    <div key={user.id} className="col s12 m6 l6">
                        <User 
                        userDelete={this.userDelete}
                        userMakeAdmin={this.userMakeAdmin}
                        userMakeCashier={this.userMakeCashier}
                        id={user.id}
                        uid={user.uid}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        phoneNumber={user.phoneNumber}
                        email={user.email}
                        photoURL={user.photoURL}
                        claims={user.claims}
                        />
                    </div>
                    );
            })}
            </div>
        );
    }
}

export default Users;