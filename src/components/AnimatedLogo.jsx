import React from 'react';
import logoanimation from "../images/Qr Code.gif";

function AnimatedLogo(props) {
    return (
        // <video src={logoanimation} autoPlay loop muted width={100} height={100} />
        <img src={logoanimation} alt="logo" width={props.w} height={props.h} />
    );
}

export default AnimatedLogo;