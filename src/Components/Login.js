import React, { useState } from 'react';
import { attemptLogin } from '../store';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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

const Login = ()=> {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const onChange = ev => {
    setCredentials({...credentials, [ ev.target.name ]: ev.target.value });
  };

  const login = (ev)=> {
    ev.preventDefault();
    dispatch(attemptLogin(credentials));
    navigate('/');
  };
  
  return (
    <div id='login-body'>
      <div id='login-title-container'>
        <span style={{ color: 'orange' }}>o</span>li<span style={{ color: 'orange' }}>o</span>li<span style={{ color: 'orange' }}>o</span>
      </div>
      <div id='login-form-container'>
        <form className='mui-form' onSubmit={ login }>

          <TextFieldStyled 
            sx={{
              borderColor: '#33bbce',
              marginBottom: '1rem',
              marginTop: '1rem'
            }}
            fullWidth 
            autoFocus
            variant='standard'
            placeholder='Email Address'
            value={ credentials.email }
            name={ 'email' }
            onChange={ onChange }
          />

          <TextFieldStyled 
            sx={{
              borderColor: '#33bbce',
              marginBottom: '2rem'
            }}
            fullWidth 
            variant='standard'
            placeholder='Password'
            value={ credentials.password }
            name={ 'password' }
            type='password'
            onChange={ onChange }
          />      

          <SaveButtonStyled
            sx={{
                backgroundColor: '#33bbce',
                width: '60%'
            }}
            type='submit'
            variant='contained' 
            disabled={ !credentials.email || !credentials.password > 0 ? true : false }
          >
            Log In
          </SaveButtonStyled>
        </form>
      </div>
      
      <div id='no-login'>
        No Login? <Link to='/register'>Register Here</Link>.
      </div>
    </div>
  );
};

export default Login;
