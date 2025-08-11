import 'antd/dist/reset.css';
import './styles/global.scss';

import { ConfigProvider, theme } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: { colorPrimary: '#7c3aed', borderRadius: 8 },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
