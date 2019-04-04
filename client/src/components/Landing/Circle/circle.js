import React from 'react';
import './circle.css';


function Circle(props) {
    return (
            <div className="circle valign-wrapper">
                <p className="center-align">{props.info}</p>
            </div>
    )
}

export default Circle;