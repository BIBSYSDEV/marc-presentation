import React from 'react';
import './index.css';
import App from './App';
import { USE_MOCK_DATA } from './constants';
import { interceptRequestsOnMock } from './mock-interceptors';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
if (USE_MOCK_DATA) {
  interceptRequestsOnMock();
}
createRoot(container).render(<App />);
