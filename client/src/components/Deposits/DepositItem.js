import React from 'react';
import { withRouter } from 'react-router-dom';
import { withAuthUserContext } from '../Auth/Session/AuthUserContext';

import moment from "moment";

const DepositItem = (props) => {
    // decontruct props
    let { uid, amount, ones, fives, tens, twenties, fifties, hundreds, time, user } =  props.deposit;
    let jsDate = new Date(time);
    const dateTime = moment(jsDate).format("YYYY-MM-DD HH:mm:ss");

    return ( 
        <li className="collection-item avatar z-depth-2">
            <i className="material-icons circle green">attach_money</i>
            <h5 className="title row">
                <div className ="col s6 m3">{dateTime}</div>
                <div className ="col s6 m3">{user}</div>
                <div className ="col s12 m3 offset-m3">${amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
            </h5>
            <div className="row">
                <blockquote>Ones: ${ones*1},
                Fives: ${fives*5},
                Tens: ${tens*10},
                Twentys: ${twenties*20},
                Fifties: ${fifties*50},
                Hundreds: ${hundreds*100}
                </blockquote>
            </div>
            <a href="#!" className="secondary-content"><i className="material-icons">grade</i></a>
        </li>
    );
};

export default withAuthUserContext(withRouter(DepositItem));