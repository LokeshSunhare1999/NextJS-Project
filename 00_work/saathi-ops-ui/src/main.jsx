import React, { createRef } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import CloseIcon from './assets/icons/closeIcon.svg';
import styled from 'styled-components';
import { UserProvider } from './context/UserContext.jsx';
import ModalProvider from './context/ModalProvider.jsx';

const queryClient = new QueryClient();
const notistackRef = createRef();
const onClickDismiss = (key) => {
  notistackRef?.current?.closeSnackbar(key);
};

const Img = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const SnackBarWrapper = styled(SnackbarProvider)`
  font-family: Poppins;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 40px;
`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SnackBarWrapper
      ref={notistackRef}
      autoHideDuration={2000}
      action={(key) => (
        <Img
          src={CloseIcon}
          alt="CloseIcon"
          onClick={() => {
            onClickDismiss(key);
          }}
        />
      )}
      maxSnack={1}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
    >
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ModalProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </ModalProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </SnackBarWrapper>
  </React.StrictMode>,
);
