import React from 'react';
import { useSelector } from 'react-redux';

const Summary = () => {

    const { auth, btc, wallets, entries } = useSelector (state => state)

    const _wallets = wallets.filter(wallet => wallet.userId === auth.id).map(wallet => wallet.id);
    const _entries = entries.filter(entry => _wallets.includes(entry.walletId))

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
        return num.toLocaleString("en-US", { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    const custPerc = (num) => {
        return num.toLocaleString("en-US", { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    return(
        <>
            <div id='wallet-detail-title'>
                Total Portfolio Summary
            </div>

            <div id='summary-container'>

                <div id='total-values-container' className='entry-line'>
                    <div id='summary-total-btc'>
                        <span className='summary-title' style={{ color: 'orange' }}>Total BTC</span>: 
                        { btcTotal().toFixed(8) }
                    </div>

                    <div id='summary-total-usd'>
                        <span className='summary-title' style={{color: '#33bbce'}}>USD Value</span>: { custLocaleString(usdTotal()) }
                    </div>
                </div>

                <div id='summary-avgspend-container' className='entry-line'>
                    { (_entries.length > 0) ? (
                        <div id='summary-avg'>
                            <span className='summary-title'>USD Avg.</span>: { custLocaleString(usdAvg()) }
                        </div>) 
                    : '' }

                    { (_entries.length > 0) ? (
                        <div id='summary-spend'>
                            <span className='summary-title'>USD Spend</span>: { custLocaleString(usdSpend()) }
                        </div>
                    ) : ''}
                </div>

                { (_entries.length > 0) ? (
                    <div className='entry-line'>
                        <span className='summary-title'>Unrealized +/-</span>: <span className={ (usdDiff() > 0) ? 'pos-num' : 'neg-num' } id='summary-unrealized'>{ custLocaleString(usdDiff()) } ({ custPerc(usdPerc()) })</span>
                    </div>
                ) : '' }

                { (soldTotal > 0) ? (
                    <div className='entry-line'>
                        <span className='summary-title'>Realized +/-</span>: <span className={ (soldTotal > 0) ? 'pos-num' : 'neg-num' } id='summary-realized'>{ custLocaleString(soldTotal) }</span>
                    </div>
                ) : '' }

                { (soldTotal > 0) ? (
                    <div className='entry-line'>
                        <span className='summary-title'>All-Time +/-</span>:  <span className={ (allTimeDiff() > 0) ? 'pos-num' : 'neg-num' } id='summary-alltime'>{ custLocaleString(allTimeDiff()) } ({ custPerc(allTimePerc())})</span>
                    </div>
                ) : '' }
            </div>
        </>
    );
};

export default Summary;