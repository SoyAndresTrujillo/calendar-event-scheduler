import 'antd/dist/reset.css';
import './styles/global.scss';

import { ConfigProvider, theme } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            // Ocean Minimalist Palette
            colorPrimary: '#5F97AA',
            colorInfo: '#5F97AA',
            colorSuccess: '#22C55E',
            colorError: '#DC2626',
            colorText: '#18363E',
            colorLink: '#5F97AA',
            colorBgBase: '#FFFFFF',
            borderRadius: 8,
          },
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
