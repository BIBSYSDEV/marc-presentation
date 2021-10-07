import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { USE_MOCK_DATA } from './constants';
import { interceptRequestsOnMock } from './mock-interceptors';

if (USE_MOCK_DATA) {
  interceptRequestsOnMock();
}

ReactDOM.render(<App />, document.getElementById('root'));
