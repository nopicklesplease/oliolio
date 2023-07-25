import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { createEntry, fetchEntries, updateEntry } from '../store';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { InputAdornment, MenuItem } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { red } from '@mui/material/colors';

const SelectStyled = styled(Select)({
    label: {
        color: 'red'
    },
    "& label.Mui-focused": {
        color: "orange"
      },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'orange',
    }
})

const TextFieldStyled = styled(TextField)({
    "& label.Mui-focused": {
        color: "#33bbce"
      },
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

const EditEntry = ({ editCheckClose, entryPrice, entrySoldBtc, entryVolume, entryIsSale }) => {

    const [volume, setVolume] = useState('');
    const [price, setPrice] = useState('');
    const [soldBtc, setSoldBtc] = useState('');
    const [isSale, setIsSale] = useState(false);
    const [isPopupVisible, setPopupVisible] = useState(false);


    const dispatch = useDispatch();

    const entryHash = useLocation().hash;
    const id = entryHash.slice(14, entryHash.length);
    
    console.log('entryPrice: ', price);
    console.log('entrySoldBtc: ', soldBtc);
    console.log('entryVolume: ', volume);
    console.log('entryIsSale:', isSale)

    const _updateEntry = async(ev) => {
        ev.preventDefault();
        await dispatch(updateEntry({ id, volume, price, soldBtc }));
        editCheckClose();
    }

    useEffect(()=> {
        setVolume(entryVolume);
        setPrice(entryPrice);
        setSoldBtc(entrySoldBtc);
        setIsSale(entryIsSale);
    }, []);

    return(

        <div id='create-entry-container' style={{ paddingBottom: 0 }}>

            {isSale ? 
                <span className='editEntry-title' style={{color: 'red'}}>SELL</span> 
            : 
                <span className='editEntry-title' style={{color: 'green'}}>BUY</span>
            }
            
            {/* <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Entry Type</InputLabel>
        <SelectStyled
            sx={{
                backgroundColor: 'white'
            }}   
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={isSale}
            label="Entry Type"
            onChange={ev => setIsSale(ev.target.value)}
        >
          <MenuItem value={false}>Buy</MenuItem>
          <MenuItem value={true}>Sell</MenuItem>

        </SelectStyled>
      </FormControl> */}

            {/* <select style={{ marginRight: '1rem', height: '23px', marginTop: '.2rem' }} onChange={ ev => setIsSale(ev.target.value) }>
                <option value={ 'false' }>
                    Buy
                </option>
                <option value={ 'true' }>
                    Sell
                </option>
            </select> */}

            { (isSale === false) ?  
                <form onSubmit={ _updateEntry }>

<div style={{marginTop: '1.5rem'}}>
                    <TextFieldStyled 
                        sx={{
                            borderBottomColor: '#33bbce',
                        }}
                        fullWidth 
                        autoFocus
                        variant='standard' 
                        value={ volume } 
                        label='Volume (USD)'
                        type='number'
                        InputProps={{
                            startAdornment: <InputAdornment sx={{paddingLeft: '.25rem', paddingBottom: '.25rem'}} position='start'><i class="fa-solid fa-dollar-sign"></i></InputAdornment>
                        }}
                        onChange={ ev => setVolume(ev.target.value) } 
                    />
</div>

                    <div className='entry-textFields'>
                        <TextFieldStyled 
                            sx={{
                                borderBottomColor: '#33bbce'
                            }}
                            fullWidth
                            variant='standard' 
                            value={ price } 
                            label='Price (USD)'
                            type='number'
                            InputProps={{
                                startAdornment: <InputAdornment sx={{paddingLeft: '.25rem', paddingBottom: '.25rem'}} position='start'><i class="fa-solid fa-dollar-sign"></i></InputAdornment>
                            }}
                            onChange={ ev => setPrice(ev.target.value) } 
                        />
                    </div>

                    <div className='popup-buttons' style={{marginTop: '2rem'}}>

                    <SaveButtonStyled
                        sx={{
                            backgroundColor: '#33bbce',
                        }}
                        type='submit'
                        variant='contained' 
                        disabled={ (!price || !volume) ? true : false }
                    >
                        Save
                    </SaveButtonStyled>

                    <CloseButtonStyled 
                        sx={{
                            backgroundColor: '#c9c9c9',
                            color: 'white',
                            marginLeft: '.5rem'
                        }}
                        onClick={ editCheckClose }
                        variant='contained' 
                    >
                        Cancel
                    </CloseButtonStyled>

                    </div>

                </form>
            : 
                <form onSubmit={ _updateEntry }>
                    {/* BTC Volume:  */}

                    <div style={{marginTop: '2rem'}}>
                    <TextFieldStyled 
                        sx={{
                            borderBottomColor: '#33bbce'
                        }}
                        fullWidth 
                        autoFocus
                        variant='standard' 
                        value={ soldBtc } 
                        label='Volume (BTC)'
                        type='number'
                        InputProps={{
                            startAdornment: <InputAdornment sx={{paddingLeft: '.25rem', paddingBottom: '.25rem'}} position='start'><i class="fa-solid fa-bitcoin-sign"></i></InputAdornment>
                        }}
                        onChange={ ev => setSoldBtc(ev.target.value) } 
                    />
                </div>

                <div className='entry-textFields'>
                    <TextFieldStyled 
                        sx={{
                            borderBottomColor: '#33bbce'
                        }}
                        fullWidth 
                        variant='standard' 
                        value={ price } 
                        label='Price (USD)'
                        type='number'
                        InputProps={{
                            startAdornment: <InputAdornment sx={{paddingLeft: '.25rem', paddingBottom: '.25rem'}} position='start'><i class="fa-solid fa-dollar-sign"></i></InputAdornment>
                        }}
                        onChange={ ev => setPrice(ev.target.value) } 
                    />
                </div>

                    <div className='popup-buttons' style={{marginTop: '2.5rem'}}>

                    <SaveButtonStyled
                        sx={{
                            backgroundColor: '#ff3434',
                        }}
                        type='submit'
                        variant='contained' 
                        disabled={ !price || !soldBtc ? true : false }
                    >
                        Save
                    </SaveButtonStyled>

                    <CloseButtonStyled 
                        sx={{
                            backgroundColor: '#c9c9c9',
                            color: 'white',
                            marginLeft: '.5rem'
                        }}
                        onClick={ editCheckClose }
                        variant='contained' 
                    >
                        Cancel
                    </CloseButtonStyled>

                    </div>

                </form> }
        </div>
    );
};

export default EditEntry;