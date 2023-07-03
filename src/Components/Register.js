import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { attemptLogin, createUser } from '../store';

const Register = () => {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const credentials = {
        username: username,
        password: password
      };
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const create = async(ev) => {
        ev.preventDefault();
        await dispatch(createUser({email, username, password}));
        dispatch(attemptLogin(credentials));
        setEmail('');
        setUsername('');
        setPassword('');
        navigate('/createwallet');
    }

    return(
        <div>
            <div id='login-body'>
                <div id='login-title-container'>
                    <span style={{ color: 'orange' }}>o</span>li<span style={{ color: 'orange' }}>o</span>li<span style={{ color: 'orange' }}>o</span>
                </div>
                <div id='login-form-container'>
                    <form onSubmit={ create }>
                        <input
                            placeholder='email'
                            value = { email }
                            name = 'username'
                            onChange = { ev => setEmail(ev.target.value) }
                        />
                        <input style={{ marginLeft: '.5rem' }}
                            placeholder='username'
                            value = { username }
                            name = 'username'
                            onChange = { ev => setUsername(ev.target.value) }
                        />
                        <input style={{ marginLeft: '.5rem', marginRight: '.5rem' }}
                            placeholder='password'
                            name = 'password'
                            type = 'password'
                            value={ password }
                            onChange = { ev => setPassword(ev.target.value) }
                        />
                        <button>Create Account</button>
                    </form>
                </div>

                <div id='profile-email-warning' style={{ color: '#2a603f' }}>
                    Consider using a masked email address that won't reveal your personal identity. Need one? Try <a target='_blank' href='https://www.simplelogin.io'>simplelogin.io</a>.
                </div>

                <div id='no-login'>
                Already Registered? <Link to='/'>Log In Here</Link>
                </div>
            </div>
        </div>
    )
}

export default Register;