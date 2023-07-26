import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { attemptLogin, createUser } from '../store';
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

const Register = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const credentials = {
        email: email,
        password: password
      };
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const create = async(ev) => {
        ev.preventDefault();
        await dispatch(createUser({ email, password }));
        dispatch(attemptLogin(credentials));
        setEmail('');
        setPassword('');
        navigate('/#/createwallet');
    }

    return(
        <div>
            <div id='login-body'>
                <div id='login-title-container'>
                    <span style={{ color: 'orange' }}>o</span>li<span style={{ color: 'orange' }}>o</span>li<span style={{ color: 'orange' }}>o</span>
                </div>
                <div id='login-form-container'>
                    <form className='mui-form' onSubmit={ create }>

                    <TextFieldStyled 
                        sx={{
                        borderColor: '#33bbce',
                        marginTop: '1rem',
                        marginBottom: '1rem'
                        }}
                        fullWidth 
                        autoFocus
                        variant='standard'
                        placeholder='Email Address'
                        value={ email }
                        name={ 'email' }
                        onChange={ ev => setEmail(ev.target.value) }
                    />

                    <TextFieldStyled 
                        sx={{
                        borderColor: '#33bbce',
                        marginBottom: '2rem'
                        }}
                        fullWidth 
                        variant='standard'
                        placeholder='Password'
                        value={ password }
                        name={ 'password' }
                        type='password'
                        onChange={ ev => setPassword(ev.target.value) }
                    />

                    <SaveButtonStyled
                        sx={{
                            backgroundColor: '#33bbce',
                            width: '60%'
                        }}
                        type='submit'
                        variant='contained' 
                        disabled={ !email || !password > 0 ? true : false }
                    >
                        Create Account
                    </SaveButtonStyled>
                    </form>
                </div>

                {/* <div id='profile-email-warning' style={{ color: '#2a603f' }}>
                    Consider using a masked email address that won't reveal your personal identity. Need one? Try <a target='_blank' href='https://www.simplelogin.io'>simplelogin.io</a>.
                </div> */}

                <div id='no-login'>
                Already Registered? <Link to='/login'>Log In Here</Link>.
                </div>
            </div>
        </div>
    )
}

export default Register;