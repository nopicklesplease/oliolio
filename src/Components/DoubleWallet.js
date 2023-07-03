import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { destroyWallet, destroyEntry, updateWallet } from '../store';
import CreateEntry from './CreateEntry';
import MarqueeStats from './MarqueeStats';

const DoubleWallet = () => {

    const { btc, wallets, entries } = useSelector (state => state)

    const [name, setName] = useState('');
    const [volume, setVolume] = useState ('');
    const [price, setPrice] = useState('');
    const [editNameToggle, setEditNameToggle] = useState(true);
    const [editEntryToggle, setEditEntryToggle] = useState(true);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const walletHash = useLocation().hash;
    const id = walletHash.slice(14, walletHash.length);

    const _wallet = wallets.find(wallet => wallet.id === id);
    const _entries = entries.filter(entry => entry.walletId === _wallet.id)

    const toggleNameInput = () => {
        setEditNameToggle(false);
    }

    const toggleEntryInput = () => {
        setEditEntryToggle(false);
    }

    const updateName = async(ev) => {
        ev.preventDefault();
        await dispatch(updateWallet({ id, name }));
        setEditNameToggle(true);
    }

    const updateEntry = async(ev) => {
        ev.preventDefault();
        await dispatch(updateEntry({ id, volume, price }));
        setEditEntryToggle(true);
    }

    const _destroyWallet = (wallet) => {

        const _entries = entries.filter(walletEntries => walletEntries.walletId === wallet.id);

        _entries.map(entry => {
            dispatch(destroyEntry(entry))
        })

        dispatch(destroyWallet(wallet));

        navigate('/');
    }

    const _destroyEntry = (entry) => {
        dispatch(destroyEntry(entry));
    }

    useEffect(() => {
        if(_wallet){
            setName(_wallet.name);
        }
    }, [wallets])

    const btcSubtotal = _entries.map(entry => entry.btc).reduce((acc, val) => {
        acc += (val * 1);
        return acc;
    }, 0);

    const soldTotal = _entries.map(entry => entry.soldBtc).reduce((acc, val) => {
        acc += (val * 1);
        return acc;
    }, 0);

    const soldUSDTotal = () => {
        const prices = _entries.filter(entry => entry.isSale === true).map(entry => entry.price).reduce((acc, val) => {
            acc += (val * 1);
            return acc;
        }, 0);

        return prices * soldTotal;
    }

    const btcTotal = () => {
        return btcSubtotal - soldTotal;
    }

    const usdTotal = () => {
        return btcTotal() * btc.price;
    }

    const usdSpend = () => {
        const totalVolume = _entries.map(entry => entry.volume).reduce((acc, val) => {
            acc += (val * 1);
            return acc;
        }, 0);

        return ((totalVolume - soldUSDTotal()) > 0) ? (totalVolume - soldUSDTotal()) : 0
    }

    const usdAvg = () => {
        return ((usdSpend() / btcTotal()) * 1);
    }

    const usdDiff = () => {
        return ((usdTotal() - usdSpend()))
    }

    const allTimeDiff = () => {
        return ((usdTotal() - usdSpend()) + soldUSDTotal())
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

    const entryNavigate = (entry) => {
        navigate(`#/api/entries/${ entry }`);
    }

    if(!_wallet) {
        return null;
    }

    return(
        <div id='detail-container'>
            <div id='wallet-detail-title'>
                { editNameToggle ? 
                    <span id='wallet-name'> 
                        { _wallet.name } 
                        <span style={{ marginLeft: '.25em' }} className='edit-button' onClick={ toggleNameInput }>
                            <i style={{ cursor: 'pointer' }} className="fa-regular fa-pen-to-square fa-2xs"></i>
                        </span>
                    </span> 
                : 
                    <span>
                        <input id='input-wallet-name' value={ name } onChange={ ev => setName(ev.target.value) } />
                        <span className='save-button' onClick={ updateName }>
                            <i className="fa-regular fa-floppy-disk fa-2xs"></i>
                        </span>
                    </span> 
                }
            </div>
            <div id='wallet-marquee'>
                <MarqueeStats />
            </div>
                <CreateEntry />
            <div id='wallet-line-items'>

                <div className='entry-line-title'>
                    <div id='entry-title-del'>
                        DEL
                    </div>
                    <div id='entry-title-type' style={{ marginLeft: '.5rem' }}>
                        TYPE
                    </div>

                    <div id='entry-title-datetime-container'>
                        <div id='entry-title-date'>
                            DATE
                        </div>
                        <div id='entry-title-time'>
                            TIME
                        </div>
                    </div>

                    <div id='entry-title-btcusd-container' style={{ marginLeft: '-.5rem' }}>
                        <div id='entry-title-btc'>
                            BTC VOL
                        </div>
                        <div id='entry-title-price'>
                            USD PRICE
                        </div>
                    </div>

                    <div id='entry-title-valuecostbasis-container'>
                        <div id='entry-title-value'>
                            VALUE
                        </div>
                        <div id='entry-title-costbasis'>
                            COST BASIS
                        </div>
                    </div>

                    <div id='entry-title-totals-container'>
                        <div id='entry-title-totaldiff'>
                            TOTAL +/-
                        </div>
                        <div id='entry-title-totalperc'>
                            TOTAL %
                        </div>
                    </div>
                </div>

                <ol>
                    <span>
                        { entries.filter(entry => entry.walletId === id).map(entry => {
                            return(
                                <li className='list-items' key={ entry.id }>
                                    <div className="entry-line">
                                        <div style={{ fontSize: '1.25rem' }} id='entry-delete-container' onClick={ ev => _destroyEntry(entry) }>
                                            <i style={{ marginLeft: '1rem' }} className="fa-regular fa-trash-can"></i> 
                                        </div>

                                        <div id='entry-type-container'>
                                            <div id={ 'entry-type' }>
                                                { entry.isSale ? 
                                                    <span style={{ color: 'red' }}>
                                                        Sell
                                                    </span> 
                                                    : 
                                                    <span style={{ color: 'green' }}>
                                                        Buy
                                                    </span>}
                                            </div>
                                        </div>

                                        <div id="entry-date-container" onClick={() => entryNavigate(entry.id)}>
                                                <i className="fa-solid fa-magnifying-glass fa-xs"></i> 
                                                <div id='entry-date-inner-container'>
                                                    <div className='entry-li' id='entry-date'>
                                                        { entry.createdAt.slice(0, 10) } 
                                                    </div>
                                                    <div className='entry-li' id='entry-time'>
                                                        { entry.createdAt.slice(11, 19) }
                                                    </div>
                                                </div>
                                        </div>

                                        { entry.soldBtc === null ? 
                                            <div id="entry-btc-container">
                                                <div id='entry-btc'>
                                                    { entry.btc }
                                                </div>
                                                <div id='entry-price'>
                                                    @ { custLocaleString(entry.price * 1) }
                                                </div>
                                            </div> 
                                        :
                                            <div id="entry-btc-container">
                                                <div id='entry-btc'>
                                                    { entry.soldBtc * -1 }
                                                </div>
                                                <div id='entry-price'>
                                                    @ { custLocaleString(entry.price * 1) }
                                                </div>
                                            </div> 
                                        }

                                        { entry.soldBtc === null ? 
                                            <div id="entry-value-volume-container" className={ (((entry.btc * btc.price)-(entry.volume)) > 0) ? 'pos-num' : 'neg-num' }>
                                                <div id='entry-usd-value'>
                                                    { custLocaleString((entry.btc * btc.price)) }
                                                </div>
                                                <div id='entry-volume'>
                                                    { custLocaleString(entry.volume * 1) }
                                                </div>
                                            </div> 
                                        : 
                                            <div id="entry-sold-container" className='sell-entry'>
                                                <div id='entry-usd-value'>
                                                    { custLocaleString((entry.soldBtc * entry.price)) }
                                                </div>
                                            </div>  
                                        }

                                        { entry.soldBtc === null ?  
                                            <div id="entry-diff-container" className={ (((entry.btc * btc.price)-(entry.volume)) > 0) ? 'pos-num' : 'neg-num' }>
                                                <div id='entry-usd-diff'>
                                                    { custLocaleString(((entry.btc * btc.price)-(entry.volume))) }
                                                </div>
                                                <div id='entry-diff-perc'>
                                                    { custPerc((((entry.btc * btc.price)-(entry.volume))/entry.volume)*1) }
                                                </div>
                                            </div> 
                                        :
                                            <div id="entry-na-container" className='sell-entry'>
                                                <div>
                                                    N/A
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </li>
                            )
                        }) }
                    </span>       
                </ol>

            </div>
            <div id='delete-wallet-title' onClick={ ev => _destroyWallet(_wallet) }> 
                <span>
                    Delete { _wallet.name }
                </span>
            </div>
        </div>
    );
};

export default DoubleWallet;