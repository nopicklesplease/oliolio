import React, { useState } from 'react';
import { attemptLogin } from '../store';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Login = ()=> {
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    username: '',
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
        <form onSubmit={ login }>
          <input
            placeholder='username'
            value = { credentials.username }
            name = 'username'
            onChange = { onChange }
            />
          <input style={{ marginLeft: '.5rem', marginRight: '.5rem' }}
            placeholder='password'
            name = 'password'
            type = 'password'
            value={ credentials.password }
            onChange = { onChange }
          />
          <button>Login</button>
        </form>
      </div>
      <div id='no-login'>
        No Login? 
        <Link to='/register'>Register Here</Link>
      </div>
    </div>
  );
};

export default Login;
