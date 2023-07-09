import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createWallet, fetchWallets } from '../store';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';


const TextFieldStyled = styled(TextField)({
    "& .MuiInput-underline:after":{
        borderBottomColor: 'orange'
    },

    '& label.Mui-focused': {
        color: 'black',
      },

});

const SaveButtonStyled = styled(Button)({
    '&:hover': {
        backgroundColor: 'orange',
    },
})

const CreateWallet = () => {

    const { auth } = useSelector (state => state)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [name, setName] = useState('');

    const create = async(ev) => {
        ev.preventDefault();
        await dispatch(createWallet({ name, userId: auth.id}, navigate, location));
        setName('');
        dispatch(fetchWallets());
    }
    return(
        <div>
            <div id='wallet-detail-title'>
                Create Wallet
            </div>
            <div id='create-wallet-detail'>

                <TextFieldStyled 
                    sx={{
                        borderColor: '#33bbce'
                    }}

                    fullWidth 
                    autoFocus
                    variant='standard'
                    placeholder='Wallet Name' 
                    onChange={ ev => setName(ev.target.value) }
                />

                <div className='create-wallet-button'>
                    <SaveButtonStyled
                        sx={{
                            backgroundColor: '#33bbce',
                        }}
                        type='submit'
                        variant='contained' 
                        onClick={ create }
                        disabled={ !name > 0 ? true : false }
                    >
                        Create Wallet
                    </SaveButtonStyled>
                </div>
            </div>
        </div>
    );
};

export default CreateWallet;