import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { updateUser, destroyEntry, destroyWallet } from '../store';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const TextFieldStyled = styled(TextField)({
    "& .MuiInput-underline:after":{
        borderBottomColor: 'orange'
    }
})

const SaveButtonStyled = styled(Button)({
    '&:hover': {
        backgroundColor: 'orange',
    },
})

const CloseButtonStyled = styled(Button)({
    '&:hover': {
        backgroundColor: '#c9c9c9',
    },
})

const ProfileDetail = () => {

    const { auth, wallets, entries } = useSelector(state => state);

    const authHash = useLocation().hash;
    const id = authHash.slice(7, authHash.length);

    const [email, setEmail] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [username, setUsername] = useState('');
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');

    const popupWindow = useRef(null);

    const dispatch = useDispatch();

    const updateEmail = async(ev) => {
        ev.preventDefault();
        const { id } = auth;
        await dispatch(updateUser({ id, email }));
        setPopupVisible(false);
    }

    const updateUsername = async(ev) => {
        ev.preventDefault();
        const { id } = auth;
        await dispatch(updateUser({id, username}));
        setPopupVisible(false);
    }

    const _destroyWallet = (wallet) => {
        const _entries = entries.filter(walletEntries => walletEntries.walletId === wallet.id);

        _entries.map(entry => {
            dispatch(destroyEntry(entry))
        })

        dispatch(destroyWallet(wallet));
    }

    useEffect(() => {
        if(auth){
            setEmail(auth.email);
            setUsername(auth.username);
        }
    }, [auth])

    const _wallets = wallets.filter(wallet => wallet.userId === auth.id);

    const editCheck = (title) => {
        setPopupVisible(true);
        setPopupTitle(title);
    }

    const editCheckClose = () => {
        setPopupVisible(false);
    }

    const closePopupWindow = (e) => {
        if(popupWindow.current && !popupWindow.current.contains(e.target)){
            setPopupVisible(false);
        }
    }

    document.addEventListener('mousedown', closePopupWindow)

    if(!auth){
        return null;
    }

    return(
        <>
            <div id='wallet-detail-title'>
                    <span id='username'>Profile 
                    </span> 
            </div>

            <div id='profile-container'>
                <div id='profile-left-container'>
                    <span style={{ fontWeight: '700', marginRight: '.25rem' }}>
                        Email Address: 
                    </span> 
                    <span>

                            <span>
                                { auth.email }
                                <span onClick={ () => editCheck('Edit Email Address') } className='edit-button'>
                                    <i className="fa-regular fa-pen-to-square fa-xs"></i>
                                </span>
                            </span>

                    </span>
                    <div id='profile-email-warning'>
                        Consider using a masked email address that won't reveal your personal identity. Need one? Try <a target='_blank' href='https://www.simplelogin.io'>simplelogin.io</a>.
                    </div>

                    <div className='entry-line-title' id='associated-wallets'>
                        Associated Wallets
                    </div>

                    {_wallets.length === 0 ? 
                        <div id='profile-nowallet-warning'>
                        You don't have any wallets yet! <Link to='/'>Create one here.</Link>
                        </div>
                    : 
                        <>
                            { _wallets.map(wallet => {
                                return(
                                    <div key={ wallet.id }>
                                        <div className='entry-line' id='associated-wallet-container'>
                                            
                                            <div id='associated-wallet-name'>
                                                <Link to={ `#/api/wallets/${ wallet.id }` }>{ wallet.name }</Link>
                                            </div>
                                        </div>
                                    </div>
                                    
                                )
                            }) }
                        </>
                    }
                </div>
            </div>

            { isPopupVisible && (
                <div className='modalBackground'>
                    <div className='modal-title' id={ `${ popupTitle.includes('Delete') && 'modal-title-delete' }` }>
                        { popupTitle }
                    </div>

                    {popupTitle.includes('Email') && (
                        <div ref={ popupWindow } className="modalContainer">
                            
                            <TextFieldStyled 
                                sx={{
                                    borderBottomColor: '#33bbce'
                                }}
                                fullWidth 
                                autoFocus
                                variant='standard' 
                                value={ email } 
                                inputProps={{ maxLength: 30 }}
                                onChange={ ev => setEmail(ev.target.value) } 
                            />

                            <div className='popup-buttons'>

                                <SaveButtonStyled
                                    sx={{
                                        backgroundColor: '#33bbce',
                                    }}
                                    type='submit'
                                    variant='contained' 
                                    onClick={ updateEmail }
                                    disabled={ !email > 0 ? true : false }
                                >
                                    Save
                                </SaveButtonStyled>

                                <CloseButtonStyled 
                                    sx={{
                                        backgroundColor: '#c9c9c9',
                                        color: 'white',
                                        marginLeft: '.5rem'
                                    }}
                                    variant='contained' 
                                    onClick={editCheckClose}
                                >
                                    Cancel
                                </CloseButtonStyled>

                            </div>

                        </div>
                    )}

                    {popupTitle.includes('Username') && (
                        <div ref={ popupWindow } className="modalContainer">
                            
                            <TextFieldStyled 
                                sx={{
                                    borderBottomColor: '#33bbce'
                                }}
                                fullWidth 
                                autoFocus
                                variant='standard' 
                                value={ username } 
                                inputProps={{ maxLength: 30 }}
                                onChange={ ev => setUsername(ev.target.value) } 
                            />

                            <div className='popup-buttons'>

                                <SaveButtonStyled
                                    sx={{
                                        backgroundColor: '#33bbce',
                                    }}
                                    type='submit'
                                    variant='contained' 
                                    onClick={ updateUsername }
                                    disabled={ !username > 0 ? true : false }
                                >
                                    Save
                                </SaveButtonStyled>

                                <CloseButtonStyled 
                                    sx={{
                                        backgroundColor: '#c9c9c9',
                                        color: 'white',
                                        marginLeft: '.5rem'
                                    }}
                                    variant='contained' 
                                    onClick={editCheckClose}
                                >
                                    Cancel
                                </CloseButtonStyled>

                            </div>

                        </div>
                    )}

                </div>
            )}
        </>
    );
};

export default ProfileDetail;