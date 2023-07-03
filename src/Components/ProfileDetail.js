import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { updateUser, destroyEntry, destroyWallet } from '../store';
import { Input } from '@mui/material';

const ProfileDetail = () => {

    const { auth, wallets, entries } = useSelector(state => state);

    const authHash = useLocation().hash;
    const id = authHash.slice(7, authHash.length);

    const [email, setEmail] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [username, setUsername] = useState('');
    const [editUsernameToggle, setEditUsernameToggle] = useState(true);
    const [editEmailToggle, setEditEmailToggle] = useState(true);

    const dispatch = useDispatch();
    const ref = useRef();

    const toggleEmailInput = () => {
        setEditEmailToggle(false);
    }

    const toggleUsernameInput = () => {
        setEditUsernameToggle(false);
    }

    const updateEmail = async(ev) => {
        ev.preventDefault();
        const { id } = auth;
        await dispatch(updateUser({ id, email }));
        setEditEmailToggle(true);
    }

    const updateImage = async(ev) => {
        ev.preventDefault();
        const { id } = auth;
        await dispatch(updateUser({id, imageUrl}));
    }

    const updateUsername = async(ev) => {
        ev.preventDefault();
        const { id } = auth;
        await dispatch(updateUser({id, username}));
        setEditUsernameToggle(true);
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
            setImageUrl(auth.imageUrl);
            setUsername(auth.username);
        }
    }, [auth])

    useEffect(() => {
        ref.current.addEventListener('change', (ev) => {
            const file = ev.target.files[0];
            const reader = new FileReader();
            
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                setImageUrl(reader.result);
                auth.imageUrl = reader.result;
                
            })
        });
    }, [ref]);

    const _wallets = wallets.filter(wallet => wallet.userId === auth.id);

    if(!auth){
        return null;
    }

    return(
        <>
            <div id='wallet-detail-title'>
                { editUsernameToggle ? 
                    <span id='username'>{ auth.username } 
                        <span style={{ marginLeft: '.25em' }} className='edit-button' onClick={ toggleUsernameInput }>
                            <i style={{ cursor: 'pointer' }} className="fa-regular fa-pen-to-square fa-2xs"></i>
                        </span>
                    </span> 
                : 
                    <span>
                        <input id='input-username' value={ username } onChange={ ev => setUsername(ev.target.value) }/>
                            <span className='save-button' onClick={ updateUsername }>
                                <i className="fa-regular fa-floppy-disk fa-2xs"></i>
                            </span>
                    </span> 
                }
            </div>

            <div id='profile-container'>
                <div id='profile-left-container'>
                    <span style={{ fontWeight: '700' }}>
                        Email Address: 
                    </span> 
                    <span>
                        { editEmailToggle ? (
                            <span>
                                { auth.email }
                                <span className='edit-button' onClick={ toggleEmailInput }>
                                    <i className="fa-regular fa-pen-to-square fa-xs"></i>
                                </span>
                            </span>
                        ) : (
                            <span>
                                <input style={{ width: '45%' }}value={ email } id='input-email' onChange={ ev => setEmail(ev.target.value) }/>
                                <span className='save-button' onClick={ updateEmail }>
                                    <i className="fa-regular fa-floppy-disk"></i>
                                </span>
                            </span>
                        )}
                    </span>
                    <div id='profile-email-warning'>
                        Consider using a masked email address that won't reveal your personal identity. Need one? Try <a target='_blank' href='https://www.simplelogin.io'>simplelogin.io</a>.
                    </div>

                    <div className='entry-line-title' id='associated-wallets'>
                        Associated Wallets:
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
                                            <div id='associated-wallet-del'>
                                                <i style={{ marginLeft: '.5rem' }} className="fa-regular fa-trash-can" onClick={ ev => _destroyWallet(wallet) }></i> 
                                            </div>
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
        
                <div id='profile-right-container'>
                    <div id='profile-img-container'>
                        <img src={ imageUrl }/>
                    </div>
                    
                    <div id='profile-form-container'>
                        <form onSubmit ={ updateImage }>
                            <Input type='file' ref={ ref }/>
                            <div id='profile-button-container'>
                                <button style={{ marginTop: '1rem', fontSize: '1rem' }}>
                                    Update Profile Photo
                                </button>
                            </div>
                        </form>       
                    </div>  
                </div>   
            </div>
        </>
    );
};

export default ProfileDetail;