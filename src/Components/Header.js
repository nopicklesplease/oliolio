import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store';
import { Divide as Hamburger } from 'hamburger-react'
import { setHidden } from '../store';

const Header = () => {
    const { auth, wallets } = useSelector(state => state);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [hamburgerOpen, setHamburgerOpen] = useState(false)
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [walletDropdownVisible, setWalletDropdownVisible] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);

    const userWallets = wallets.filter(wallet => wallet.userId === auth.id)

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
      }, [width]);

    const profileNavigate = () => {
        navigate(`#/user/${ auth.id }`)
    }

    const _logout = () => {
        dispatch(logout());
        navigate('/');
    }

    const handleDropdownToggle = () => {
        setDropdownVisible(!dropdownVisible);
        setHamburgerOpen(!hamburgerOpen);
    };

    const walletDropdownToggle = () => {
        setWalletDropdownVisible(!walletDropdownVisible);
    };

    const walletDropdownNavigate = (inp) => {
        if(inp == null){
            navigate('#/createwallet')
        } else {
            navigate(`#/api/wallets/${ inp }`);
        }
    }

    const mainMenu = useRef(null);
    const walletMenu = useRef(null);

    const closeMainMenu = (e) => {
        if(mainMenu.current && hamburgerOpen && !mainMenu.current.contains(e.target)){
            setHamburgerOpen(false);
            setDropdownVisible(false);
        }
    }

    const closeWalletMenu = (e) => {
        if(walletMenu.current && !walletMenu.current.contains(e.target)){
            setWalletDropdownVisible(false);
        }
    }

    document.addEventListener('mousedown', closeMainMenu)
    document.addEventListener('mousedown', closeWalletMenu)

    const hamburgerSizeSwitch = () => {
        switch(true) {
            case (width > 1024):
                return 30;
            case (width > 500):
                return 25;
            case (width > 300):
                return 20;
            default:
                return 12;
        }
    }

    return(
        <div id='header-container'>
            <div id='header-title-outer-container'>
                <div id='header-title'>
                    <Link to='/'>
                        Portf<span style={{ color: 'orange' }}>o</span>li<span style={{ color: 'orange' }}>o</span>li<span style={{ color: 'orange' }}>o</span>
                    </Link>
                </div>
            </div>
            <div id='hidden-outer-container'>
                <div id='hidden' onClick={ walletDropdownToggle }>

                <div id='wallet-dropdown'>
                    <div ref={ walletMenu } className={ `wallet-dropdown ${ walletDropdownVisible ? 'visible' : '' }` }>
                        <div onClick={ walletDropdownToggle }>
                            <i class="fa-solid fa-wallet"></i>
                        </div>

                        <div className='wallet-dropdown-content'>
                            <ol>
                                {userWallets.map(wallet => {
                                    return(
                                        <li className='wallet-dropdown-li' key={ wallet.id } onClick={ () => walletDropdownNavigate(wallet.id) }>
                                            { wallet.name }
                                        </li>
                                    )
                                })}
                                <li className='wallet-dropdown-li' id='wallet-dropdown-create' onClick={ () => walletDropdownNavigate() }>
                                    Create New Wallet
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>

                </div>
            </div>
            
            <div id='header-user'>
                <div id='header-dropdown'>
                    <div ref={ mainMenu } className={ `dropdown ${ dropdownVisible ? 'visible' : '' }` }>
                        <div onClick={handleDropdownToggle}>
                            <Hamburger toggled={ hamburgerOpen } size={hamburgerSizeSwitch()} toggle={setHamburgerOpen} />
                        </div>

                        <div className='dropdown-content'>
                            <Link to='/' onClick={ handleDropdownToggle }>
                                Home
                            </Link>

                            <Link to={`#/user/${ auth.id }`} onClick={ handleDropdownToggle }>
                                Profile
                            </Link>

                            <li className='logout-link' key={ 'logout' } onMouseDown={ _logout }>Logout</li> 
                        </div>
                        {/* { auth.username.slice(0,1).toUpperCase() + '.' } */}
                        {/* <img id='profile-thumb' src={ auth.imageUrl } /> */}
                    </div>
                    {/* <div className="dropdown-content">
                        <li key={ 'profile' } onMouseDown={ profileNavigate }>Profile</li>
                        <li key={ 'logout' } onMouseDown={ _logout }>Logout</li>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Header;