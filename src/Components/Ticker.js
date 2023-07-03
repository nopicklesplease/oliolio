import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Logo from './Logo';
import WalletContainer from './WalletContainer';
import CreateWalletDetail from './CreateWalletDetail'
import Summary from './Summary';
import DoubleWallet from './DoubleWallet';
import DoubleEntry from './DoubleEntry';
import ProfileDetail from './ProfileDetail';
import WalletStats from './WalletStats';

const Ticker = () => {

    const { auth, wallets } = useSelector (state => state)
    const { hash } = useLocation();

    console.log('this is the hash', hash)

    const filteredWallets = wallets.filter(wallet => wallet.userId === auth.id).map(wallet => wallet.id);

    if(!auth){
        return null;
    }

    return(
        <div id='content-body'>
            <div id='left-side-outer-container'>

                <div id='left-side-inner-container'>
                    <Header />
                </div>

                <div id='left-side-lower-body'>
                    <Logo />
                </div>

                <WalletContainer />
                { hash.includes('wallets') && <WalletStats /> }

            </div>
            <div className="outer-list-container">
                <div className="inner-list-container">

                    { filteredWallets.length > 0 ? 
                        <>
                            { hash.includes('wallets') && <DoubleWallet /> }
                            { hash.includes('entries') && <DoubleEntry /> }
                            { hash === '' && <Summary /> }
                            { hash.includes('user') && <ProfileDetail /> }
                            { hash === '#/createwallet' && <CreateWalletDetail /> }
                        </>
                    :
                        <>
                            { hash === '#/createwallet' && <CreateWalletDetail /> }
                            { hash.includes('user') && <ProfileDetail /> }           
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default Ticker;