import React from 'react';

import { withRouter } from 'react-router-dom';
import { withAuthUserContext } from '../Auth/Session/AuthUserContext';
import Util from "../Util/Util";

class DepositArchive extends React.Component {
    // State used for Dialog box to confirm delete
    state = {
        openConfirmDelete: false,
    };
    
    handleClickOpen = () => {
        this.setState({ openConfirmDelete: true });
    };

    handleClose = () => {
        this.setState({ openConfirmDelete: false });
    };

    handleDelete= (_id) => {
        this.setState({ openConfirmDelete: false });
        this.props.prospectDelete(_id);
    };
    
    render() {
        // decontruct props
        let { id, amount, time, email, awaitingSettlement, settled} =  this.props.depositInfo;
        //let {  } =  this.props;

        if (id === null ) {
            return(null);
        }
                
        return ( 
            <div className="card horizontal">
                <div className="card-stacked">
                    <div className="card-content">
                        <span className="card-title">Deposit: ${Util.formatMoney(amount, 0)}</span>
                        <p>{time.toString()}</p>
                        <p>{email}</p>
                        <p>Awaiting Settlement? {awaitingSettlement}</p>
                        <p>Settled? {settled}</p>
                    </div>
                    <div className="card-action">
                        <div className="left-align">
                            <div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ); // return
    } // render
}

export default withAuthUserContext(withRouter(DepositArchive));