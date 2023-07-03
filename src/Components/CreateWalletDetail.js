import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createWallet, fetchWallets } from '../store';

const CreateWallet = () => {

    const { auth } = useSelector (state => state)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [name, setName] = useState('');

    const create = async(ev) => {
        ev.preventDefault();
        await dispatch(createWallet({ name, userId: auth.id}, navigate, location));
        setName('');
        dispatch(fetchWallets());
    }
    return(
        <div>
            <div id='wallet-detail-title'>
                Create Wallet
            </div>
            <div id='create-wallet-detail'>
                <form onSubmit={ create }>
                    Wallet Name: 
                    <input value={ name } onChange={ ev => setName(ev.target.value) } required />

                    <button id='create-button'>
                        Create
                    </button>

                </form>
            </div>
        </div>
    );
};

export default CreateWallet;