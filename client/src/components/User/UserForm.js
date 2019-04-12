import React from 'react';
import UserAPI from "./UserAPI"
  
class UserForm extends React.Component {
  state = {
    id: this.props.id,
    firstName: "",
    lastName: "",
    photoURL: "",
    phoneNumber: "",
    email: "",
    uid: "",
    claims: "noauth",
    message: ""
  };

  fetchUser = (id) => {
    UserAPI.get(id)
    .then(user => {
      this.setState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        photoURL: user.photoURL || "",
        phoneNumber: user.phoneNumber || "",
        uid: user.uid || "",
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
    console.log(`id: ${this.state.id}`);
    if (this.state.id) {
      this.fetchUser(this.state.id);
    } else {
    }
  }

  addUser = () => {
    console.log(`adding user to db`);
    const user = this.state;
    UserAPI.updateFBOnly(user).then (id => {
      // set message to show update
      this.setState({
        message: "New User Added - they must Sign Up to authorize",
        id: id
      });
    }).catch (err => {
      // set message to show update
      this.setState({message: `Error adding user ${err}`});
    });
  }

  updateUser = () => {
    console.log(`updating db with user.uid:${this.state.uid}`);

    const user = this.state;
    UserAPI.update(user).then (user => {
      // set message to show update
      this.setState({message: "User Updated"});
    }).catch (err => {
      // set message to show update
      this.setState({message: `Error updating user ${err}`});
    });
  }

  saveUser = (e) => {
    e.preventDefault();
    // Update current user in firestore (and auth for some fields)
    if (this.state.id) {
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

    let buttonText, emailEnabled;
    if (this.state.id) {
      buttonText = "Update";
      emailEnabled = false;
    } else {
      buttonText = "Create";
      emailEnabled = true;
    }

    const isValid = 
      firstName !== "" &&
      lastName !== "" &&
      phoneNumber !== "";

      return ( 
          <div className="container">
            <h5 className="grey-text text-darken-3">User <span>(Role: {claims})</span></h5>
            <div className="input-field">
              <label className="active" htmlFor="email">Email</label>
              <input disabled={!emailEnabled} type="email" name='email' value={email} onChange={this.onChange} />
            </div>
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