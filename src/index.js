import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './Components/App';
import { Provider } from 'react-redux';
import store from './store';
import { HashRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const customTypography = createTheme({
  typography: {
      fontFamily: 'League Spartan',
  },
})

const root = createRoot(document.querySelector('#root'));

root.render(
<ThemeProvider theme={customTypography}>
  <Provider store={ store }>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
</ThemeProvider>
);
