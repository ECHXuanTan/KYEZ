import React from 'react';
import { createRoot } from 'react-dom/client'; 
// import './styles/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';


const root = createRoot(document.getElementById('root')); 

root.render(
  <Provider store={store}>
  <App />
</Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
