import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { createEntry, fetchEntries } from '../store';

const CreateEntry = () => {

    const [volume, setVolume] = useState('');
    const [price, setPrice] = useState('');
    const [soldBtc, setSoldBtc] = useState('');
    const [isSale, setIsSale] = useState('false');

    const dispatch = useDispatch();

    const entryHash = useLocation().hash;
    const id = entryHash.slice(14, entryHash.length);

    const create = async(ev) => {
        ev.preventDefault();
        await dispatch(createEntry({volume, price, walletId: id}));
        dispatch(fetchEntries());
        setVolume('');
        setPrice('');
    }

    const sell = async(ev) => {
        ev.preventDefault();
        await dispatch(createEntry({ soldBtc, price, walletId: id, isSale: true }));
        dispatch(fetchEntries());
        setSoldBtc('');
        setPrice('');
    }

    return(

        <div id='create-entry-container'>
            <select style={{ marginRight: '1rem', height: '23px', marginTop: '.2rem' }} onChange={ ev => setIsSale(ev.target.value) }>
                <option value={ 'false' }>
                    Buy
                </option>
                <option value={ 'true' }>
                    Sell
                </option>
            </select>

            { (isSale === 'false') ?  
                <form onSubmit={ create }>
                    USD Volume: 
                    <input value={ volume } style={{ marginRight: '1rem' }} onChange={ ev => setVolume(ev.target.value) } required />
                    Price: 
                    <input value={ price } style={{ marginRight: '.5rem' }} onChange={ ev => setPrice(ev.target.value) } required />

                    <button id='create-button'>
                        Create Entry
                    </button>
                </form>
            : 
                <form onSubmit={ sell }>
                    BTC Volume: 
                    <input value={ soldBtc } style={{ marginRight: '1rem' }} onChange={ ev => setSoldBtc(ev.target.value) } required />
                    Price: 
                    <input value={ price } style={{ marginRight: '.5rem' }} onChange={ ev => setPrice(ev.target.value) } required />

                    <button id='create-button'>
                        Create Entry
                    </button>
                </form> }
        </div>
    );
};

export default CreateEntry;