import React from 'react';
import UserAPI from "../User/UserAPI"

class AccountForm extends React.Component {

    state = {
        id: this.props.uid,
        uid: this.props.uid,
        firstName: "",
        lastName: "",
        photoURL: "",
        phoneNumber: "",
        email: "",
        claims: "",
        message: ""
    };

    fetchUser = (uid) => {
        UserAPI
            .get(uid)
            .then(user => {
                this.setState({
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    photoURL: user.photoURL || "",
                    phoneNumber: user.phoneNumber || "",
                    uid: user.uid,
                    claims: user.claims || "user",
                    email: user.email
                });
                // Dont need to get custom claims since they are passed in props from context
                // and can not be changed here
            })
            .catch(err => {
                console.error(`Error getting user ${err}`);
                this.setState({error: `Error getting user ${err}`});
            });
    };

    componentDidMount() {
        // since t hey are auth, uid == id
        console.log(`authUser.uid: ${this.state.uid}`);
        this.fetchUser(this.state.uid);
    }

    updateUser = (e) => {
        e.preventDefault();
        // Update current user in firestore (and auth for some fields)
        console.log(`updating db with user.uid:${this.state.uid}`);
        const user = this.state;
        UserAPI
            .updateCurrent(user)
            .then(user => {
                // set message to show update
                this.setState({message: "Account Updated"});
            })
            .catch(err => {
                // set message to show update
                this.setState({message: `Error updating account ${err}`});
            });
    };

    onChange = event => {
        event.preventDefault();

        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {

        const {
            firstName,
            lastName,
            photoURL,
            phoneNumber,
            email,
            claims,
            message
        } = this.state;

        const isValid = firstName !== "" && lastName !== "" && phoneNumber !== "";

        return (
            <div className="container">
                <h5 className="grey-text text-darken-3">User
                    <span>(Role: {claims})</span>
                </h5>
                <div className="input-field">
                    <label className="active" htmlFor="email">Email</label>
                    <input
                        disabled={true}
                        type="email"
                        name='email'
                        value={email}
                        onChange={this.onChange}/>
                </div>
                <div className="input-field">
                    <label className="active" htmlFor="firstName">First Name</label>
                    <input type="text" name='firstName' value={firstName} onChange={this.onChange}/>
                </div>
                <div className="input-field">
                    <label className="active" htmlFor="lastName">Last Name</label>
                    <input type="text" name='lastName' value={lastName} onChange={this.onChange}/>
                </div>
                <div className="input-field">
                    <label className="active" htmlFor="photoURL">Photo URL</label>
                    <input type="text" name='photoURL' value={photoURL} onChange={this.onChange}/>
                </div>
                <div className="input-field">
                    <label className="active" htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="text"
                        name='phoneNumber'
                        value={phoneNumber}
                        onChange={this.onChange}/>
                </div>
                <div>
                    <button
                        disabled={!isValid}
                        onClick={this.updateUser}
                        className="btn lighten-1 z-depth-0">Update
                    </button>
                    <p> { message} </p>
                </div>
            </div>
        );
    }
}

export default AccountForm;