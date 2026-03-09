import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// StrictMode intentionally omitted to prevent double WS connections in dev
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
