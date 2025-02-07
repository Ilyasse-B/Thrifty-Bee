import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import { AuthProvider } from "./AuthContext"; //This is used for the login state, so its global to all pages
import { BrowserRouter } from "react-router-dom"; // Import Router
import store from './redux/store.js';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store = {store}>
      <BrowserRouter> {/* Wrap App in Router */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
