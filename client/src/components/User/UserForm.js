import React from 'react';
import UserAPI from "./UserAPI"
  
class UserForm extends React.Component {
  updateMode = false;

  state = {
    uid: this.props.uid,
    firstName: "",
    lastName: "",
    photoURL: "",
    phoneNumber: "",
    email: "",
    claims: "noauth",
    message: ""
  };

  fetchUser = (uid) => {
    UserAPI.get(uid)
    .then(user => {
      this.setState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        photoURL: user.photoURL || "",
        phoneNumber: user.phoneNumber || "",
        claims: user.claims || "noauth",
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
    console.log(`uid: ${this.state.uid}`);
    if (this.state.uid) {
      this.updateMode = true;
      this.fetchUser(this.state.uid);
    } else {
      this.updateMode = false;
    }
  }

  addUser = () => {
    console.log(`adding user to db with`);
  }

  updateUser = () => {
    console.log(`updating db with user.uid:${this.state.uid}`);

    const user = this.state;
    UserAPI.update(user).then (user => {
      // set message to show update
      this.setState({message: "Account Updated"});
    }).catch (err => {
      // set message to show update
      this.setState({message: `Error updating account ${err}`});
    });
  }

  saveUser = (e) => {
    e.preventDefault();
    // Update current user in firestore (and auth for some fields)
    if (this.updateMode) {
      this.updateUser();
    } else {
      this.addUser();
    }
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

    let buttonText;
    if (this.updateMode) {
      buttonText = "Update";
    } else {
      buttonText = "Create";
    }

    const isValid = 
      firstName !== "" &&
      lastName !== "" &&
      phoneNumber !== "";

      return ( 
          <div className="container">
            <h5 className="grey-text text-darken-3">User <span>(Role: {claims})</span></h5>
            <label className="active">Email: {email}</label>
            <div className="input-field">
              <label className="active" htmlFor="firstName">First Name</label>
              <input type="text" name='firstName' value={firstName} onChange={this.onChange} />
            </div>
            <div className="input-field">
              <label className="active" htmlFor="lastName">Last Name</label>
              <input type="text" name='lastName' value={lastName} onChange={this.onChange} />
            </div>
            <div className="input-field">
              <label className="active" htmlFor="photoURL">Photo URL</label>
              <input type="text" name='photoURL' value={photoURL} onChange={this.onChange} />
            </div>
            <div className="input-field">
              <label className="active" htmlFor="phoneNumber">Phone Number</label>
              <input type="text" name='phoneNumber' value={phoneNumber} onChange={this.onChange} />
            </div>
            <div>
              <button disabled={!isValid} onClick={this.saveUser} className="btn lighten-1 z-depth-0">{buttonText}</button>
              {<p>{message}</p>}
            </div>
        </div>
        );
  }
}

export default UserForm;