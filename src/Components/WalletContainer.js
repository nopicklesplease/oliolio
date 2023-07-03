import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import WalletStats from './WalletStats';

const WalletContainer = () => {
    const { wallets, auth } = useSelector(state => state);

    const navigate = useNavigate();

    const _wallets = wallets.filter(wallet => wallet.userId === auth.id)

    const dropdownNavigate = (wallet) => {
        if(wallet === '') return null;
        wallet === 'create-wallet' ? navigate('#/createwallet') : navigate(`#/api/wallets/${wallet}`)
    }

    if(!_wallets){
        return null;
    }

    return(
        <div id='wallet-outer-container'>
            <div id='wallet-inner-container'>
                <div id='wallet-dropdown-title'>
                    { _wallets.length === 0 ? 'Wallets:' : 'Wallet:'}
                </div>

                { _wallets.length === 0 ? 
                    <div id='no-wallets-message'>You don't currently have any of these.</div> 
                : (
                    <div id='wallet-dropdown'>
                        <select className='wallet-dropdown-object' onChange={ ev => dropdownNavigate(ev.target.value)}>
                            <option value=''>Select Wallet</option>
                            { _wallets.map(wallet => {
                                return(
                                    <option value={ wallet.id } key={ wallet.id }>
                                        { wallet.name }
                                    </option>
                                )
                            }) }
                            <option value='create-wallet' key='1'>
                                *** Create New Wallet ***
                            </option>
                        </select>
                    </div>
                ) }
            </div>
        </div>
    );
};

export default WalletContainer;