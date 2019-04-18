import React from 'react';
import { withRouter } from 'react-router-dom';
import { withAuthUserContext } from '../Auth/Session/AuthUserContext';
import Avatar from '@material-ui/core/Avatar';
import AttachMoney from '@material-ui/icons/AttachMoney';

import moment from "moment";


const DepositItem = (props) => {
    // decontruct props
    let { uid, amount, ones, tens, twentys, fifties, hundreds, time, user } =  props.deposit;
    // let jsDate = new Date(time);
    const dateTime = moment(time).format("YYYY-MM-DD HH:mm:ss");

    return ( 
        <div className="card horizontal">
            <div className="card-stacked">
                <div className="card-content">
                    <Avatar className="blue">
                        <AttachMoney />
                    </Avatar>          
                    <span className="card-title">${amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                    <p>Date: {dateTime}</p>
                    <p>User: {user}</p>
                    <p>Ones: {ones}</p>
                    <p>Tens: {tens}</p>
                    <p>Twentys: {twentys}</p>
                    <p>Fifties: {fifties}</p>
                    <p>Hundreds: {hundreds}</p>
                </div>
            </div>
        </div>
    );
};

export default withAuthUserContext(withRouter(DepositItem));