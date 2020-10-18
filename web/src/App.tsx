import React from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './styles/global.scss'
import 'leaflet/dist/leaflet.css';

import Routes from './Routes/routes';

const App: React.FC = () => {
  return (
    <>
      <ToastContainer
        draggable={false}
        autoClose={2000}
      />
      <Routes />
    </>
  );
}

export default App;
