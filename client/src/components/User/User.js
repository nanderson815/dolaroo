import React from 'react';

const User = (props) => {
    // decontruct props
    let { uid, firstName, lastName, phoneNumber, email, role } =  props;
    let { userMakeAdmin, userDelete } =  props;

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
                    <i className="userDelete material-icons left" onClick={userDelete.bind(uid)}>delete</i>
                </a>
                <button onClick={userMakeAdmin.bind(uid)} className="btn">Make Admin</button>
            </div>
        </div>          
    );
}

export default User;