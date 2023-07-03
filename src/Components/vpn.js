import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const VPN = () => {

    const [editVPNToggle, setEditVPNToggle] = useState(true);
    const navigate = useNavigate();

    const toggleVPN = () => {
        setEditVPNToggle(false);
    }

    return(
        <div>
            <div id='login-body'>
                <div id='vpn-container'>
                VPN on?
                </div>

                <div id='vpn-button-container'>
                    <button className='vpn-button' onMouseDown={() => navigate('/login')}>
                        YES
                    </button> 
                    <button className='vpn-button' onMouseDown={ toggleVPN }>
                        NO
                    </button>
                </div>

                { editVPNToggle ? 
                    <div style={{ marginTop: '2.9rem' }}></div> 
                : 
                    <div id='vpn-warning'>
                        Consider using a VPN service that won't reveal your IP address before accessing this website. Don't have a VPN? Try <a target='_blank' href='https://nordvpn.com'>NordVPN</a>.     
                    </div> 
                } 
            </div>
        </div>
    );
};

export default VPN;