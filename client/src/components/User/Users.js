import React from 'react';
import User from './UserAPI';
import { withAuthUserContext } from '../Auth/Session/AuthUserContext';
import { withFirebase } from '../Auth/Firebase/FirebaseContext';
import Util from "../Util/Util"
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
        UserAPI.getUsers(this.props.firebase.db)
        .then(res => {
            const users = [...res.data];
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
    userDelete = (uid) => {

        UserAPI.delete(this.props.firebase.db, uid )
        .then(res => {
            console.log("Deleted user");
        })
        .catch(err => {
            console.error(err); 
        });
    }

    // Delete this article from MongoDB
    userMakeAdmin = (uid) => {

        UserAPI.makeAdmin(this.props.firebase.db, uid )
        .then(res => {
            console.log("Made User Admin");
        })
        .catch(err => {
            console.error(err); 
        });
    }        
    
    render() {
        return (
            <div className="row">
            {this.state.users.map((user) => {
                return(            
                    <div key={user.uid} className="col s12 m6 l6">
                        <User 
                        userDelete={this.userDelete}
                        userMakeAdmin={this.userMakeAdmin}
                        uid={user.uid}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        phoneNumber={user.phoneNumber}
                        email={user.email}
                        role={user.role}
                        />
                    </div>
                    );
            })}
            </div>
        );
    }
}

export default withAuthUserContext(withFirebase(Users));