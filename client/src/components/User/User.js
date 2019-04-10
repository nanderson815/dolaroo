import React from 'react';
// import UserAPI from "./UserAPI";

const User = (props) => {
    // decontruct props
    let { id, firstName, lastName, phoneNumber, email, claims } =  props;
    let { userMakeAdmin, userMakeCashier, userDelete } =  props;

    let userRole;
    if (claims && claims.admin) {
        userRole = "admin"
    } else if (claims && claims.cashier){
        userRole = "cashier"
    } else {
        userRole = "user"
    }

    return ( 
        <div className="card">
            <div className="card-content">
                <span className="flow-text card-title">{firstName} {lastName}</span>
                <p className="truncate">email: {email}</p>
                <p className="truncate">phoneNumber: {phoneNumber}</p>
                <p className="truncate">role: {userRole}</p>
            </div>
            <div className="card-action">
                <a href="#!" className="indigo-text text-darken-4">
                    <i className="userDelete material-icons left" onClick={() => userDelete(id)}>delete</i>
                </a>
                <button onClick={() => userMakeAdmin(id)} className="btn">Make Admin</button>
                <button onClick={() => userMakeCashier(id)} className="btn">Make Cashier</button>
            </div>
        </div>          
    );
}

export default User;