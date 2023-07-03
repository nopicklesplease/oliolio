import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';


const MarqueeStats = () => {

    const { btc, wallets, entries } = useSelector (state => state)

    const walletHash = useLocation().hash;
    const id = walletHash.slice(14, walletHash.length);

    const _wallet = wallets.find(wallet => wallet.id === id);
    const _entries = entries.filter(entry => entry.walletId === _wallet.id)

    const btcSubtotal = _entries.map(entry => entry.btc).reduce((acc, val) => {
        acc += (val * 1);
        return acc;
    }, 0);

    const soldTotal = _entries.filter(entry => (entry.isSale)).map(entry => (entry.soldBtc * entry.price) ).reduce((acc, val) => {
        acc += val * 1;
        return acc;
    }, 0);

    const soldBtcTotal = _entries.filter(entry => (entry.isSale)).map(entry => (entry.soldBtc) ).reduce((acc, val) => {
        acc += val * 1;
        return acc;
    }, 0);

    const btcTotal = () => {
        return btcSubtotal - soldBtcTotal;
    }

    const usdTotal = () => {
        return btcTotal() * btc.price;
    }

    const usdSpend = () => {
        const totalVolume = _entries.map(entry => entry.volume).reduce((acc, val) => {
            acc += (val * 1);
            return acc;
        }, 0);

        return ((totalVolume - soldTotal) > 0) ? (totalVolume - soldTotal) : 0
    }

    const usdAvg = () => {
        return ((usdSpend() / btcTotal()) * 1);
    }

    const usdDiff = () => {
        return ((usdTotal() - usdSpend()))
    }

    const allTimeDiff = () => {
        return ((usdTotal() - usdSpend()) + soldTotal)
    }

    const usdPerc = () => {
        return ((usdDiff() / usdSpend()) * 1);
    }

    const allTimePerc = () => {
        return ((allTimeDiff() / usdSpend()) * 1);
    }

    const custLocaleString = (num) => {
        return num.toLocaleString("en-US", {style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2})
    }

    const custPerc = (num) => {
        return num.toLocaleString("en-US", {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2})
    }

    if(!_wallet) {
        return null;
    }

    return(
        <div id='entry-txid-text'>
            { (_entries.length > 0) ? 
                <>
                    <span className='summary-title'>
                    Total BTC</span>: 
                    { btcTotal().toFixed(8) }

                    <i style={{ marginLeft: '1rem', marginRight: '1rem', color: '#33bbce' }} className="fa-solid fa-diamond fa-xs"></i>

                    <span className='summary-title'>
                        USD Value
                    </span>: 

                    { custLocaleString(usdTotal()) }

                <i style={{ marginLeft: '1rem', marginRight: '1rem', color: '#33bbce' }} className="fa-solid fa-diamond fa-xs"></i>

                <span className='summary-title'>
                    All-Time +/-</span>:  
                <span className={ (allTimeDiff() > 0) ? 'pos-num' : 'neg-num'} id='summary-alltime'>
                    { custLocaleString(allTimeDiff()) } ({ custPerc(allTimePerc())})
                </span>
                
            </> : ''}
        </div>
    )
}

export default MarqueeStats;