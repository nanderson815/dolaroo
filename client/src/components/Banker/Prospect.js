import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { withRouter } from 'react-router-dom';
import { withAuthUserContext } from '../Auth/Session/AuthUserContext';
import Util from "../Util/Util";

const Prospect = (props) => {
    // decontruct props
    let { _id, firstName, lastName, company, revenue, locations, email,  cash, phone} =  props.prospectInfo;
    let { prospectDelete } =  props;

    if (_id === null ) {
        return(null);
    }
    
    // Send to edit page
    const prospectEdit = () => {
        console.error("Edit not implemented yet");
        // props.history.push({
        //     pathname: '/userpage',
        //     state: {_id: props.userInfo._id }
        // });
    };
    
    return ( 
        <div className="card horizontal">
            <div className="card-stacked">
                <div className="card-content">
                    <span className="card-title">{firstName} {lastName}</span>
                    <p>{email}</p>
                    <p>{company}</p>
                    <p>Phone: {phone.length > 9 ? phone.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '$1-$2-$3') : phone}</p>
                    <p>Revenue: ${Util.formatMoney(revenue, 0)}</p>
                    <p>Locations: {locations}</p>
                    <p>Cash: {cash}%</p>
                </div>
                <div className="card-action">
                    <div className="left-align">
                        <div>
                        <Tooltip title="Edit">
                            <i style={{cursor: 'pointer'}}
                                className="material-icons left indigo-text text-darken-4"
                                onClick={() => prospectEdit(_id)}>edit
                            </i>
                        </Tooltip>

                        <Tooltip title="Delete">
                            <i style={{cursor: 'pointer'}}
                                className="material-icons left indigo-text text-darken-4"
                                onClick={() => prospectDelete(_id)}>delete
                            </i>
                        </Tooltip>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuthUserContext(withRouter(Prospect));