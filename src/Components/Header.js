import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store';
import { Divide as Hamburger } from 'hamburger-react'
import { setHidden } from '../store';

const Header = () => {
    const { auth, hidden } = useSelector(state => state);

    useEffect(() => {
        dispatch(setHidden);
    }, [hidden])
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [editHiddenToggle, setHiddenToggle] = useState(true);
    const [hamburgerOpen, setHamburgerOpen] = useState(false)
    const [dropdownVisible, setDropdownVisible] = useState(false);
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

    console.log('this is so hidden', hidden);

    const toggleHidden = () => {
        dispatch(setHidden());
        return editHiddenToggle === false ? setHiddenToggle(true) : setHiddenToggle(false);
    }

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

    const mainMenu = useRef(null);

    const closeMainMenu = (e) => {
        if(mainMenu.current && hamburgerOpen && !mainMenu.current.contains(e.target)){
            setHamburgerOpen(false);
            setDropdownVisible(false);
        }
    }

    document.addEventListener('mousedown', closeMainMenu)

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
                <div id='hidden' onClick={ toggleHidden }>
                    { editHiddenToggle ? 
                        <i className="fa-regular fa-eye-slash"></i>
                    : 
                        <i className="fa-regular fa-eye"></i> 
                    }
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