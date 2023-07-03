import React from 'react';
import { useSelector } from 'react-redux';

const Logo = () => {

    const { btc } = useSelector(state => state);

    const custLocaleString = (num) => {
        if(!num) return '*******';
        return num.toLocaleString("en-US", { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    return(
        <div id='logo-container'>
            <div id='logo-img-container'>
                <img id='btc-logo' src="static/btc-logo.png" />
            </div>
            <div id='logo-price-container'>
                <div id='logo-price'>
                    { custLocaleString(btc.price * 1) }
                </div>
                <div id='logo-current-price'>
                    current price
                </div>
            </div>  
        </div>
    );
};

export default Logo;