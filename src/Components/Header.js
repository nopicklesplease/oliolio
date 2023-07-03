import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store';

const Header = () => {
    const { auth } = useSelector(state => state);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [editHiddenToggle, setHiddenToggle] = useState(true);

    const toggleHidden = () => {
        return editHiddenToggle === false ? setHiddenToggle(true) : setHiddenToggle(false);
    }

    const profileNavigate = () => {
        navigate(`#/user/${ auth.id }`)
    }

    const _logout = () => {
        dispatch(logout());
        navigate('/');
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
                    <div className='dropdown-button'>
                        { auth.username.slice(0,1).toUpperCase() + '.' }
                        <img id='profile-thumb' src={ auth.imageUrl } />
                    </div>
                    <div className="dropdown-content">
                        <li key={ 'profile' } onMouseDown={ profileNavigate }>Profile</li>
                        <li key={ 'logout' } onMouseDown={ _logout }>Logout</li>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;