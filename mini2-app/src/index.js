import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import { Provider } from 'react-redux';
import { store } from './Store.js';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        {' '}
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
);

reportWebVitals();
