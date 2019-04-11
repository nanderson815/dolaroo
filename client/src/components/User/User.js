import React from 'react';
// import UserAPI from "./UserAPI";

const User = (props) => {
    // decontruct props
    let { id, uid, firstName, lastName, phoneNumber, email, photoURL, claims } =  props;
    let { userMakeAdmin, userMakeCashier, userDelete } =  props;

    if (!photoURL) {
        photoURL = "./images/noUserImage150x150.png";
    }     

    if (uid === null ) {
        return(null);
    }

    return ( 
        <div className="card horizontal">
            <div className="card-image">
                <img style={{maxHeight: '120px'}} src={photoURL} alt={firstName} />
            </div>
            <div className="card-stacked">
                <div className="card-content">
                    <span className="card-title">{firstName} {lastName}</span>
                    <p>{email}</p>
                    <p>{phoneNumber}</p>
                    <p>Role: {claims}</p>
                </div>
                <div className="card-action">
                    <div className="center-align">
                        <i style={{cursor: 'pointer'}}
                            className="userDelete material-icons left indigo-text text-darken-4"
                            onClick={() => userDelete(id)}>delete
                        </i>
                        <i style={{cursor: 'pointer'}}
                            className="makeCashier material-icons left indigo-text text-darken-4"
                            onClick={() => userMakeCashier(id)}>account_balance
                        </i>
                        <i style={{cursor: 'pointer'}}
                            className="makeAdmin material-icons left indigo-text text-darken-4"
                            onClick={() => userMakeAdmin(id)}>account_circle
                        </i>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;