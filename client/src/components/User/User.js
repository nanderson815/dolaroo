import React from 'react';
import { withRouter } from 'react-router-dom';


const User = (props) => {
    // decontruct props
    let { id, firstName, lastName, phoneNumber, email, photoURL, claims } =  props;
    let { userMakeAdmin, userMakeCashier, userDelete } =  props;

    if (!photoURL) {
        photoURL = "./images/noUserImage150x150.png";
    }     

    if (id === null ) {
        return(null);
    }
    
    // Send to edit page
    const userEdit = () => {
        props.history.push({
            pathname: '/userpage',
            state: {id: props.id }
        });
    };
    
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
                            className="userEdit material-icons left indigo-text text-darken-4"
                            onClick={() => userEdit(id)}>edit
                        </i>
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

export default withRouter(User);