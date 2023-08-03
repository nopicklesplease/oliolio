import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { destroyWallet, updateWallet } from '../store';

const WalletStats = (width) => {

    const { btc, wallets, entries } = useSelector (state => state)

    const walletHash = useLocation().hash;
    const id = walletHash.slice(14, walletHash.length);

    if(!entries) return null;
    if(!wallets) return null;

    const _wallet = wallets.find(wallet => wallet.id === id);

    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [editNameToggle, setEditNameToggle] = useState(true);
    const [showMore, setShowMore] = useState(false);

    const toggleNameInput = () => {
        setEditNameToggle(false);
    }

    const updateName = async(ev) => {
        ev.preventDefault();
        await dispatch(updateWallet({ id, name }));
        setEditNameToggle(true);
    }

    const _destroyWallet = (wallet) => {
        dispatch(destroyWallet(wallet));
    }

    useEffect(() => {
        if(_wallet){
            setName(_wallet.name);
        }
    }, [])

    if(!_wallet) return null;
    
    const _entries = entries.filter(entry => entry.walletId === _wallet.id)

    const btcSubtotal = _entries.map(entry => entry.btc).reduce((acc, val) => {
        acc += (val * 1);
        return acc;
    }, 0);

    const posPerc = (num) => {
        return num > 0 ? (num - 1) : num;
    }

    const _soldEntries = _entries.filter(entry => entry.isSale);

    const soldTotal = _soldEntries.map(entry => (entry.soldBtc * entry.price) ).reduce((acc, val) => {
        acc += val * 1;
        return acc;
    }, 0);

    const soldAvg = _soldEntries.map(entry => (entry.soldBtc * entry.soldAvg)).reduce((acc, val) => {
        acc += val * 1;
        return acc;
    }, 0)

    const soldAvgPerc = ((soldTotal / soldAvg)*1)-1;

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

    return(
        <div className='wallet-footer-container'>
        <div className='wallet-footer-inner'>
        <div onClick={ () => setShowMore(!showMore) }>
                        <div className='ft-totalBTC'>

                        {/* {showMore ? <span className='ft-symbols' style={{marginRight: '1.5rem', color: '#33bbce'}}><i className="fa-solid fa-square-caret-down fa-xs"></i></span>
                         : <span className='ft-symbols' style={{marginRight: '1.5rem', color: '#33bbce'}}><i className="fa-solid fa-square-caret-up fa-xs"></i></span>} */}

                        <span className='ft-summary-title'>BTC Total:</span><span className='ft-summarytotal-text'><span className='ft-symbols'><i className="fa-solid fa-bitcoin-sign fa-xs"></i></span>{ btcTotal().toFixed(8) } {btcSubtotal > 0 && <span style={{marginLeft: '.25rem'}}>@ { custLocaleString(usdAvg()) }</span>}</span>
                </div>

            {(width.width > 700) && (showMore === true) ? (
                <div id='ft-summary-container-small'>
                <div className='ft-title-alltime'>
                    <div id='ft-stats-title'>
                        <div className='ft-summary-total-usd'>
                            <span className='ft-summary-title' style={{ color: '#33bbce' }}>USD Value:</span> { custLocaleString(usdTotal()) }
                        </div>
                        <div className='ft-summary-total-usd'>
                            <span className='ft-summary-title' style={{color: 'orange'}}>USD Spend:</span> { custLocaleString(usdSpend()) }
                        </div>

                            <div className='ft-summary-total-usd'>
                            <span className='ft-summary-title'>USD Avg.:</span> { custLocaleString(usdAvg()) }
                        </div>
                        

                    </div>


                            <div className='ft-summary-body'>
                            <div id='ft-summary-alltime' className='entry-line'>

                            <span className='ft-summary-title'>Unrealized +/-</span>: <span className={ (usdDiff() >= 0) ? 'pos-num' : 'neg-num'} id='summary-unrealized'>
                                    { custLocaleString(usdDiff()) } 
                                    {btcSubtotal > 0 && <span style={{marginLeft: '.25rem'}}>({ custPerc(usdPerc())})
                                    </span>}
                                </span>

                            </div>


                                <div className='ft-summary-showMore-body'>
                                <div id='ft-summary-alltime' className='entry-line'>

                                <span className='ft-summary-title'>Realized +/-</span>: <span className={ (soldTotal >= 0) ? 'pos-num' : 'neg-num' } id='summary-realized'> {_soldEntries.length > 0 ? <>{ custLocaleString(soldTotal) } ({ custPerc(soldAvgPerc)})</> : 'N/A'}</span>
    
                                </div>

                                <div id='ft-summary-alltime' className='entry-line'>

                                <span className='ft-summary-title'>All-Time +/-</span>: <span className={ (allTimeDiff() > 0) ? 'pos-num' : 'neg-num' } id='summary-alltime'>{ custLocaleString(allTimeDiff()) } ({ custPerc(allTimePerc())})</span>

                                </div>

                                </div>
                                


                            </div>

                </div>
            
            </div>

            ) : ''}    

            {width.width <= 700 && (

<div id='ft-summary-container-small'>
<div className='ft-title-alltime'>
    <div id='ft-stats-title'>
        <div className='ft-summary-total-usd'>
            <span className='ft-summary-title' style={{ color: '#33bbce' }}>USD Value:</span> { custLocaleString(usdTotal()) }
        </div>
        <div className='ft-summary-total-usd'>
            <span className='ft-summary-title' style={{color: 'orange'}}>USD Spend:</span> { custLocaleString(usdSpend()) }
        </div>
        {showMore === true && (
            <div className='ft-summary-total-usd'>
            <span className='ft-summary-title'>USD Avg.:</span> { custLocaleString(usdAvg()) }
        </div>
        )}

    </div>

        { (soldTotal >= 0) && (
            <div className='ft-summary-body'>
            <div id='ft-summary-alltime' className='entry-line'>

            <span className='ft-summary-title'>Unrealized +/-</span>: <span className={ (usdDiff() >= 0) ? 'pos-num' : 'neg-num'} id='summary-unrealized'>
                    { custLocaleString(usdDiff()) } 
                    {btcSubtotal > 0 && <span style={{marginLeft: '.25rem'}}>({ custPerc(usdPerc())})
                    </span>}
                </span>

            </div>

            {showMore === true && (
                <div className='ft-summary-showMore-body'>
                <div id='ft-summary-alltime' className='entry-line'>

                <span className='ft-summary-title'>Realized +/-</span>: <span className={ (soldTotal >= 0 ) ? 'pos-num' : 'neg-num' } id='summary-realized'>{_soldEntries.length > 0 ? <>{ custLocaleString(soldTotal) } ({ custPerc(soldAvgPerc)})</> : 'N/A'}</span>

                </div>

                <div id='ft-summary-alltime' className='entry-line'>

                <span className='ft-summary-title'>All-Time +/-</span>: <span className={ (allTimeDiff() > 0) ? 'pos-num' : 'neg-num' } id='summary-alltime'>{ custLocaleString(allTimeDiff()) } ({ custPerc(allTimePerc())})</span>

                </div>

                </div>
                
            )}

            </div>
        ) }

</div>

</div>

            )}
        </div>
        </div>
        </div>
    );
};

export default WalletStats;