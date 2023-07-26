import React, { useState, useEffect } from 'react';
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
import WalletFooter from './WalletFooter';

const Ticker = () => {

    const { auth, wallets } = useSelector (state => state)
    const { hash } = useLocation();
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
      }, [width]);

    // console.log('this is the hash', hash)

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
                

                {/* <WalletContainer /> */}
                { (hash.includes('wallets') && (width > 1024) ) && <WalletStats /> }
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
                            { hash === '' && <CreateWalletDetail /> }
                        </>
                    }
                </div>
            </div>

            { hash.includes('wallets') && <WalletFooter />}
        </div>
    );
};

export default Ticker;