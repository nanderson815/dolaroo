import React from 'react';
import UserAPI from "./UserAPI";

const User = (props) => {
    // decontruct props
    let { id, firstName, lastName, phoneNumber, email, role } =  props;
    let { userMakeAdmin, userMakeCashier, userDelete } =  props;

    return ( 
        <div className="card">
            <div className="card-content">
                <span className="flow-text card-title">{firstName} {lastName}</span>
                <p className="truncate">email: {email}</p>
                <p className="truncate">phoneNumber: {phoneNumber}</p>
                <p className="truncate">role: {role}</p>
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