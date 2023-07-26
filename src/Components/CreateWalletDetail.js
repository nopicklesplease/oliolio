import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createWallet, fetchWallets } from '../store';
import FormControl from '@mui/material/FormControl';
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

            <form className='mui-form' onSubmit={ create }>
                <TextFieldStyled 
                    sx={{
                        borderColor: '#33bbce'
                    }}

                    fullWidth 
                    autoFocus
                    variant='standard'
                    placeholder='Wallet Name'
                    inputProps={{ maxLength: 30 }}
                    onChange={ ev => setName(ev.target.value) }
                />
                    <SaveButtonStyled
                        sx={{
                            backgroundColor: '#33bbce',
                            marginTop: '2rem'
                        }}
                        type='submit'
                        variant='contained' 
                        disabled={ !name > 0 ? true : false }
                    >
                        Create Wallet
                    </SaveButtonStyled>

            </form>

            </div>
        </div>
    );
};

export default CreateWallet;