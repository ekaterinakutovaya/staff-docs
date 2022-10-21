import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/es/locale/ru_RU';

import './index.scss';
import App from './App';


import {store} from "./store/store";

let persistor = persistStore(store);

const rootElem = document.getElementById('root');

if (rootElem) {
  const root = ReactDOM.createRoot(rootElem);

root.render(
  <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}>
    <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
    <ConfigProvider locale={ruRU}>
          <App />
    </ConfigProvider>
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
);

}
