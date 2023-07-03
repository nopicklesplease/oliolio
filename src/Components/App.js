import React, { useEffect } from 'react';
import Login from './Login';
import { useSelector, useDispatch } from 'react-redux';
import { loginWithToken, fetchBtc, fetchWallets, fetchEntries, fetchUsers } from '../store';
import { Routes, Route } from 'react-router-dom';
import Ticker from './Ticker';
import Register from './Register';
import Calculator from './Calculator';


const App = ()=> {
  const { auth } = useSelector(state => state);
  const dispatch = useDispatch();
  useEffect(()=> {
    dispatch(loginWithToken());
    dispatch(fetchBtc());
    dispatch(fetchWallets());
    dispatch(fetchEntries());
    dispatch(fetchUsers());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
        dispatch(fetchBtc());
    }, 60*1000);
    return () => clearInterval(interval);
}, [])

  return (
    <div>
      {
        !auth.id && (
          <div>
            <Routes>
              <Route path='/' element={ <Calculator /> } />
              <Route path='/login' element={ <Login /> } />
              <Route path='/register' element={ <Register /> } />
            </Routes>
          </div>
        )
      }

      {
        !!auth.id  && (
          <div>
            <Routes>
              <Route path='/' element={ <Ticker /> } />
            </Routes>
          </div>
        )
      }
    </div>
  );
};

export default App;
