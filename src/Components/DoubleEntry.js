import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateEntry, destroyEntry } from '../store';

const SingleEntry = () => {

    const { btc, entries, wallets } = useSelector(state => state);

    const entryHash = useLocation().hash;
    const id = entryHash.slice(14, entryHash.length);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [volume, setVolume] = useState ('');
    const [price, setPrice] = useState('');
    const [soldBtc, setSoldBtc] = useState('');
    const [editEntryToggle, setEditEntryToggle] = useState(true);

    const toggleEntryInput = () => {
        setEditEntryToggle(false);
    }

    const entry = entries.find(entry => entry.id === id)
    
    useEffect(() => {
        if(entry){
            setVolume(entry.volume);
            setPrice(entry.price);
            setSoldBtc(entry.soldBtc);
        }
    }, [entry])


    const custLocaleString = (num) => {
        return num.toLocaleString("en-US", {style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2})
    }

    const custPerc = (num) => {
        return num.toLocaleString("en-US", {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2})
    }

    if(!entry) {
        return null;
    }

    const wallet = wallets.find(wallet => wallet.id === entry.walletId);

    const _updateEntry = async(ev) => {
        ev.preventDefault();
        await dispatch(updateEntry({ id, volume, price, soldBtc }));
        setEditEntryToggle(true);
    }

    const _destroyEntry = (entry) => {
        dispatch(destroyEntry(entry));
        navigate(`#/api/wallets/${ wallet.id }`)
    }

    if(!wallet){
        return null;
    }

    return(
        <div>
            <div id='wallet-detail-title'> 
                <span> 
                    { wallet.name } 
                    <span style={{ fontSize: '1.5rem' }}>
                        (Tx Detail)
                    </span>
                </span>
            </div>

            <div id='entry-txid'>
                <span style={{ fontWeight: '700' }}>ID</span>: { entry.id }
            </div>

            <div id='content-container'>

                <div id='wallet-line-items'>
                    <div className='entry-line-title' style={{ marginTop: '2rem' }}>
                        <div id='entry-title-del'>
                            DEL
                        </div>

                        <div id='entry-title-type' style={{ marginLeft: '1rem' }}>
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

                        <div id='entry-title-btcusd-container'>
                            <div id='entry-title-btc'>
                                BTC VOL
                            </div>
                            <div id='entry-title-price'>
                                USD PRICE
                            </div>
                        </div>

                        <div id='entry-title-edit' style={{ marginRight: '1rem' }}>
                            SAVE
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
                        <li className='list-items' key={ entry.id }>
                            <div className="entry-line">

                                <div id='entry-delete-container' onClick={ ev => _destroyEntry(entry) }>
                                    <i style={{ marginLeft: '.5rem' }} className="fa-regular fa-trash-can fa-2x"></i> 
                                </div>

                                <div id='entry-type-container' style={{ fontSize: '1.5rem', marginLeft: '1rem' }}>
                                    <div id={ 'entry-type' }>
                                        { entry.isSale ? 
                                            <span style={{ color: 'red' }}>
                                                Sell
                                            </span> 
                                        : 
                                            <span style={{ color: 'green' }}>
                                                Buy
                                            </span>
                                        }
                                    </div>
                                </div>

                                <div id="entry-date-container">
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
                                        <div className='entry-field-input'>
                                            <input id='input-entry-vol' value={ volume } onChange={ ev => setVolume(ev.target.value) } />
                                        </div>
                                        <div className='entry-field-input'>
                                            <input id='input-entry-price' value={ price } onChange={ ev => setPrice(ev.target.value) } />
                                        </div>
                                    </div>
                                :
                                    <div id="entry-btc-container">
                                        <div className='entry-field-input'>
                                            <input id='input-entry-vol' value={ soldBtc } onChange={ ev => setSoldBtc(ev.target.value) } />
                                        </div>
                                        <div className='entry-field-input'>
                                            <input id='input-entry-price' value={ price } onChange={ ev => setPrice(ev.target.value) } />
                                        </div>  
                                    </div> 
                                }

                                <div id='entry-edit-container' style={{ marginRight: '1rem' }}>
                                    <span>
                                        <span className='save-button' onClick={ _updateEntry }>
                                            <i style={{ cursor: 'pointer', marginLeft: '1rem' }} className="fa-regular fa-floppy-disk  fa-2x"></i>
                                        </span>
                                    </span>
                                </div>

                                { entry.soldBtc === null ? 
                                    <div id="entry-value-volume-container" className={ (((entry.btc * btc.price)-(entry.volume)) > 0) ? 'pos-num' : 'neg-num'}>
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
                                
                                    <div id="entry-diff-container" className={ (((entry.btc * btc.price)-(entry.volume)) > 0) ? 'pos-num' : 'neg-num'}>
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
                    </ol>
                </div>
                <div id='back-to-wallet-title'> 
                    <span>
                        <Link to={ `#/api/wallets/${ wallet.id }` }>
                            Back to { wallet.name }
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SingleEntry;