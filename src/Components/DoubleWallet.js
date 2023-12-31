import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { destroyWallet, destroyEntry, updateWallet } from '../store';
import CreateEntry from './CreateEntry';
import MarqueeStats from './MarqueeStats';
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

const DoubleWallet = () => {

    const { btc, wallets, entries } = useSelector (state => state)

    const [name, setName] = useState('');
    const [volume, setVolume] = useState ('');
    const [price, setPrice] = useState('');
    const [width, setWidth] = useState(window.innerWidth);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
      }, [width]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const walletHash = useLocation().hash;
    const id = walletHash.slice(14, walletHash.length);

    const _wallet = wallets.find(wallet => wallet.id === id);
    const _entries = entries.filter(entry => entry.walletId === _wallet.id)

    useEffect(() => {
        setName(_wallet.name);
    }, [_wallet])

    const updateName = async(ev) => {
        ev.preventDefault();
        await dispatch(updateWallet({ id, name }));
        setPopupVisible(false);
    }

    const updateEntry = async(ev) => {
        ev.preventDefault();
        await dispatch(updateEntry({ id, volume, price }));
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

    const posPerc = (num) => {
        return num > 0 ? (num - 1) : num;
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

    const editCheck = (title) => {
        setPopupVisible(true);
        setPopupTitle(title);
    }

    const editCheckClose = () => {
        setPopupVisible(false);
    }

    const popupWindow = useRef(null);

    const closePopupWindow = (e) => {
        if(popupWindow.current && !popupWindow.current.contains(e.target)){
            setPopupVisible(false);
        }
    }

    document.addEventListener('mousedown', closePopupWindow)

    if(!wallets) {
        return null;
    }

    if(!entries) {
        return null;
    }

    return(
        <div id='detail-container'>
            <div id='wallet-detail-title'>
                
                <span id='wallet-name'> 
                    { _wallet.name }
                    <span style={{ marginLeft: '.5em' }} className='edit-button'>
                        <i onClick={ () => editCheck('Edit Wallet Name') } style={{ cursor: 'pointer' }} className="fa-regular fa-pen-to-square fa-2xs"></i>
                    </span>
                </span> 
                
            </div>

            {width > 1024 && (
                <>
                <div id='wallet-marquee'>
                    <MarqueeStats />
                </div>
                <div className='wide-create-entry' onClick={ () => editCheck('Create New Entry') }>
                    <span>CREATE NEW ENTRY</span>
                </div>
                </>
            )}

            {width < 1024 && (
                <div className='create-new-entry'>
                    <span onClick={ () => editCheck('Create New Entry') }>CREATE NEW ENTRY</span>
                </div>
            )}
                
            <div id='wallet-line-items'>

                <div className='entry-line-title'>
                    <div className='small-type-date-title'>
                    <div id='entry-title-type'>
                        TYPE
                    </div>

                    <div id='entry-title-datetime-container'>
                        <div id='entry-title-date'>
                            DATE
                        </div>
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

            
                                            <div className='small-type-date'>
                                        <div id='entry-type-container'>
                                            <div id={ 'entry-type' }>
                                                { entry.isSale ? 
                                                    <span style={{ color: 'red' }}>
                                                        SELL
                                                    </span> 
                                                    : 
                                                    <span style={{ color: 'green' }}>
                                                        BUY
                                                    </span>}
                                            </div>
                                        </div>

                                    

                                        <div id="entry-date-container" onClick={() => entryNavigate(entry.id)}>
                                                <div id='entry-date-inner-container'>
                                                    <div id='entry-date'>
                                                        { entry.createdAt.slice(0, 10) } 
                                                    </div>
                                                    
                                                </div>
                                        </div>

                                    </div>

                                        <span className='entryLink' onClick={() => entryNavigate(entry.id)}>


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
                                        <div id="entry-value-volume-container" className={ (((entry.soldBtc * entry.price)-(entry.soldBtc * entry.soldAvg)) > 0) ? 'pos-num' : 'neg-num' }>
                                        <div id='entry-usd-value'>
                                            { custLocaleString((entry.soldBtc * entry.price)) }
                                        </div>
                                        <div id='entry-volume'>
                                            { custLocaleString(entry.soldBtc * entry.soldAvg) }
                                        </div>
                                    </div> 
                                            // <div id="entry-sold-container" className='sell-entry'>
                                            //     <div id='entry-usd-value'>
                                            //         { custLocaleString((entry.soldBtc * entry.price)) }
                                            //     </div>
                                            //     <div id='entry-volume'>
                                            //         { custLocaleString(entry.soldBtc * entry.soldAvg) }
                                            //     </div>
                                            // </div>  
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
                                            <div id="entry-diff-container" className={ (((entry.soldBtc * entry.price)-(entry.soldBtc * entry.soldAvg)) > 0) ? 'pos-num' : 'neg-num' }>
                                            <div id='entry-usd-diff'>
                                                { custLocaleString(((entry.soldBtc * entry.price)-(entry.soldBtc * entry.soldAvg))) }
                                            </div>
                                            <div id='entry-diff-perc'>
                                                { custPerc(posPerc(((entry.soldBtc * entry.price)/(entry.soldBtc * entry.soldAvg))*1)) }
                                            </div>
                                        </div>  
                                        }
                                    </span>
                                    </div>
                                </li>
                            )
                        }) }
                    </span>       
                </ol>

            </div>

            <div id='delete-wallet-title' onClick={ () => editCheck('Delete Wallet') }> 
                <span>
                    DELETE WALLET
                </span>
            </div>

            { isPopupVisible && (
                <div className='modalBackground'>
                    <div className='modal-title' id={ `${ popupTitle.includes('Delete') ? 'modal-title-delete' : '' }` }>
                        { popupTitle }
                    </div>

                    {popupTitle.includes('Edit') && (
                        <div ref={ popupWindow } className="modalContainer">
                            <TextFieldStyled 
                                sx={{
                                    borderBottomColor: '#33bbce'
                                }}
                                fullWidth 
                                autoFocus
                                variant='standard' 
                                value={ name } 
                                inputProps={{ maxLength: 30 }}
                                onChange={ ev => setName(ev.target.value) } 
                            />

                            <div className='popup-buttons'>

                                <SaveButtonStyled
                                    sx={{
                                        backgroundColor: '#33bbce',
                                    }}
                                    type='submit'
                                    variant='contained' 
                                    onClick={ updateName }
                                    disabled={ !name > 0 ? true : false }
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

                    {popupTitle.includes('Delete') && (
                        <div ref={ popupWindow } className="modalContainer">
                            
                            <p>Are you sure you want to delete <span style={{fontWeight: 700}}>{_wallet.name}</span>?</p>
                            
                            <p>This operation cannot be undone.</p>

                            <div className='popup-buttons'>

                                <SaveButtonStyled
                                    sx={{
                                        backgroundColor: '#ff3434',
                                    }}
                                    type='submit'
                                    variant='contained' 
                                    onClick={ () => _destroyWallet(_wallet) }
                                    disabled={ !name > 0 ? true : false }
                                >
                                    Confirm
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

                    {popupTitle.includes('Create') && (
                        <div className="modalContainer">
                            <div id='create-entry-container'>
                            <CreateEntry usdAvg={ usdAvg } editCheckClose={ editCheckClose }/>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DoubleWallet;