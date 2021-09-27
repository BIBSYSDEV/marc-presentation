import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { USE_MOCK_DATA } from './constants';
import reportWebVitals from './reportWebVitals';
import { interceptRequestsOnMock } from './mock-interceptors';

if (USE_MOCK_DATA) {
  interceptRequestsOnMock();
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
