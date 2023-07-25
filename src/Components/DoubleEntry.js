import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateEntry, destroyEntry } from '../store';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import EditEntry from './EditEntry';

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

const SingleEntry = () => {

    const { btc, entries, wallets } = useSelector(state => state);

    const entryHash = useLocation().hash;
    const id = entryHash.slice(14, entryHash.length);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [volume, setVolume] = useState ('');
    const [price, setPrice] = useState('');
    const [soldBtc, setSoldBtc] = useState('');
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [isSale, setIsSale] = useState('');

    const popupWindow = useRef(null);

    const entry = entries.find(entry => entry.id === id)
    
    useEffect(() => {
        if(entry){
            setVolume(entry.volume);
            setPrice(entry.price);
            setSoldBtc(entry.soldBtc);
            setIsSale(entry.isSale);
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

    const editCheck = (title) => {
        setPopupVisible(true);
        setPopupTitle(title);
    }

    const editCheckClose = () => {
        setPopupVisible(false);
    }

    const closePopupWindow = (e) => {
        if(popupWindow.current && !popupWindow.current.contains(e.target)){
            setPopupVisible(false);
        }
    }

    document.addEventListener('mousedown', closePopupWindow)

    if(!wallet){
        return null;
    }

    return(
        <div>
            <div id='wallet-detail-title' style={{padding: '1rem'}}> 
                <span style={{fontWeight: '700', marginRight: '.35rem'}}>TXID:</span> { entry.id.slice(24) } 
            </div>

    <div className='entry-edit-delete'>
            <div id='entry-txid' onClick={ () => editCheck('Edit Entry') }>
                EDIT
            </div>
            <div id='entry-delete' onClick={ () => editCheck('Delete Entry') }>
                DELETE
            </div>
    </div>

            <div id='content-container'>

            <div id='wallet-line-items'>

<div className='entry-line-title'>
    <div className='small-type-date-title'>

    <div id='entry-title-del'>
        DEL
    </div>
    <div id='entry-title-type'>
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
                        <li className='list-items' key={ entry.id }>
                            <div className="entry-line">

                            <div className='small-type-date'>

                                <div id='entry-delete-container' onClick={ ev => _destroyEntry(entry) }>
                                    <i style={{ marginLeft: '.5rem' }} className="fa-regular fa-trash-can fa-2x"></i> 
                                </div>

                                <div id='entry-type-container'>
                                    <div id={ 'entry-type' }>
                                        { entry.isSale ? 
                                            <span style={{ color: 'red' }}>
                                                SELL
                                            </span> 
                                        : 
                                            <span style={{ color: 'green' }}>
                                                BUY
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
                    </ol>
                </div>

                <div id='back-to-wallet-title'> 
                    <span>
                        <Link to={ `#/api/wallets/${ wallet.id }` }>
                            Back to { wallet.name }
                        </Link>
                    </span>
                </div>

                { isPopupVisible && (
                <div className='modalBackground'>
                    <div className='modal-title' id={ `${ popupTitle.includes('Delete') ? 'modal-title-delete' : '' }` }>
                        { popupTitle }
                    </div>

                    {popupTitle.includes('Edit') && (
                        <div className="modalContainer">
                            
                            <EditEntry editCheckClose={ editCheckClose } entryPrice ={ price } entrySoldBtc = { soldBtc } entryVolume = { volume } entryIsSale = { isSale }/>

                        </div>
                    )}

                    {popupTitle.includes('Delete') && (
                        <div ref={ popupWindow } className="modalContainer">
                            
                            <p>Are you sure you want to delete TXID #<span style={{fontWeight: 700}}>{entry.id.slice(24)}</span>?</p>
                            
                            <p>This operation cannot be undone.</p>

                            <div className='popup-buttons'>

                                <SaveButtonStyled
                                    sx={{
                                        backgroundColor: '#ff3434',
                                    }}
                                    type='submit'
                                    variant='contained' 
                                    onClick={ () => _destroyEntry(entry) }

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

                </div>
            )}
                
            </div>
        </div>
    );
};

export default SingleEntry;