import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store.js';
import { Provider } from 'react-redux';
import axios from 'axios';
import { logoutUser } from './redux/actions/userActions.js';

axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // automatically logout the user if token has expired
  if (error.status === 401 &&
    error.response !== null &&
    error.response.data !== null &&
    error.response.data.error !== null &&
    error.response.data.error.name === "TokenExpiredError") {
    store.dispatch(logoutUser())
  }

  return Promise.reject(error);
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
