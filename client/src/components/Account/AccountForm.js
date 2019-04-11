import React from 'react';
import UserAPI from "../User/UserAPI"
  
class AccountForm extends React.Component {

  state = {
    uid: this.props.uid,
    displayName: this.props.displayName,
    phoneNumber: this.props.phoneNumber,
    message: ""
  };

  fetchUser = (uid) => {
    console.log(`fetching user with uid: ${uid}`);
    UserAPI.get(uid)
    .then(user => {
      this.setState({
        displayName: user.displayName || "",
        email: user.email,
        phoneNumber: user.phoneNumber || ""
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
    console.log(`componentDidMount user with uid: ${this.state.uid}`);
    this.fetchUser(this.state.uid);
  }

  updateUser = (e) => {
    e.preventDefault();
    // Update current user in firestore (and auth for some fields)
    console.log(`updating db with user.uid:${this.state.uid}`);
    const user = this.state;
    UserAPI.update(user).then (user => {
      // set message to show update
      this.setState({message: "Account Updated"});
    }).catch (err => {
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
      uid,
      email,
      displayName,
      phoneNumber,  
      claims,
      error
    } = this.state;

    const isValid = 
      displayName !== "" &&
      phoneNumber !== "";

      return ( 
          <div className="container">
            <h5 className="grey-text text-darken-3">User <span>(Role: {claims})</span></h5>
            <label className="active">Email: {email} Uid: {uid}</label>
            <div className="input-field">
              <label className="active" htmlFor="displayName">Display Name</label>
              <input type="text" name='displayName' value={displayName} onChange={this.onChange} />
            </div>
            <div className="input-field">
              <label className="active" htmlFor="phoneNumber">Phone Number</label>
              <input type="text" name='phoneNumber' value={phoneNumber} onChange={this.onChange} />
            </div>
            <div>
              <button disabled={!isValid} onClick={this.updateUser} className="btn lighten-1 z-depth-0">Update</button>
              {<p>{error}</p>}
            </div>
        </div>
        );
  }
}

export default AccountForm;