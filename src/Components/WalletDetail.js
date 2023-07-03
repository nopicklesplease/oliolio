import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBtc, destroyWallet, destroyEntry } from '../store';
import Header from './Header';
import Logo from './Logo';
import WalletContainer from './WalletContainer';
import DoubleWallet from './DoubleWallet';
import WalletStats from './WalletStats';

const WalletDetail = () => {

    const { auth, wallets, entries } = useSelector (state => state)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const _destroyWallet = (wallet) => {

        const _entries = entries.filter(walletEntries => walletEntries.walletId === wallet.id);

        _entries.map(entry => {
            dispatch(destroyEntry(entry))
        })

        dispatch(destroyWallet(wallet));
    }

    const _wallets = wallets.filter(wallet => wallet.userId === auth.id)

    if(!_wallets){
        return null;
    }

    return(
                <div>
                    <DoubleWallet />
                </div>

    );
};

export default WalletDetail;