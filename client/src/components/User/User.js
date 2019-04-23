import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { withRouter } from 'react-router-dom';
import { withAuthUserContext } from '../Auth/Session/AuthUserContext';

const User = (props) => {
    // decontruct props
    let { id, uid, firstName, lastName, phoneNumber, email, photoURL, claims } =  props.userInfo;
    let { userMakeAdmin, userMakeCashier, userMakeUser, userMakeBanker, userDelete } =  props;

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
            state: {id: props.userInfo.id }
        });
    };

    // dont let you delete yourself
    const editIsDisabled = (props.user && props.user.authUser && props.user.authUser.uid) ===  uid ? true: false;
    
    return ( 
        <div className="card horizontal">
            <div className="card-image">
                <img style={{maxHeight: '120px'}} src={photoURL} alt={firstName} />
            </div>
            <div className="card-stacked">
                <div className="card-content">
                    <span className="card-title">{firstName} {lastName}</span>
                    <p>{email}</p>
                    <p>{phoneNumber.length > 9 ? phoneNumber.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '$1-$2-$3') : phoneNumber}</p>
                    <p>Primary Role: {claims}</p>
                </div>
                <div className="card-action">
                    <div className="left-align">
                        {editIsDisabled ? <p><i>Current User - Cant Edit</i></p> : null}
                        {editIsDisabled ? null : 
                        <div>
                        <Tooltip title="Edit">
                            <i style={{cursor: 'pointer'}}
                                disabled={editIsDisabled}
                                className="userEdit material-icons left indigo-text text-darken-4"
                                onClick={() => userEdit(id)}>edit
                            </i>
                        </Tooltip>

                        <Tooltip title="Delete">
                            <i style={{cursor: 'pointer'}}
                                disabled={editIsDisabled}
                                className="material-icons left indigo-text text-darken-4"
                                onClick={() => userDelete(id)}>delete
                            </i>
                        </Tooltip>

                        <Tooltip title="Make Cashier">
                            <i style={{cursor: 'pointer'}}
                                disabled={editIsDisabled}
                                className="material-icons left indigo-text text-darken-4"
                                onClick={() => userMakeCashier(id)}>account_balance
                            </i>
                        </Tooltip>

                        <Tooltip title="Make Admin">
                            <i style={{cursor: 'pointer'}}
                                disabled={editIsDisabled}
                                className="material-icons left indigo-text text-darken-4"
                                onClick={() => userMakeAdmin(id)}>supervisor_account
                            </i>
                        </Tooltip>

                        <Tooltip title="Make Banker">
                            <i style={{cursor: 'pointer'}}
                                disabled={editIsDisabled}
                                className="material-icons left indigo-text text-darken-4"
                                onClick={() => userMakeBanker(id)}>next_week
                            </i>
                        </Tooltip>

                        <Tooltip title="Disable (i.e. make user)">
                            <i style={{cursor: 'pointer'}}
                                disabled={editIsDisabled}
                                className="material-icons left indigo-text text-darken-4"
                                onClick={() => userMakeUser(id)}>lock
                            </i>
                        </Tooltip>

                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuthUserContext(withRouter(User));