import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { store } from './store';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error(
    'Root element #root not found. Load the app via the Vite dev server (http://localhost:5173), not by opening the HTML file directly.'
  );
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
