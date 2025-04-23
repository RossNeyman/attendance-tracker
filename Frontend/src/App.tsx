import { useState } from 'react'
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { QrScannerPage } from './QrScannerPage.tsx';
import { StudentQRCode } from './components/StudentQrCode.tsx';
import { store } from './app/store';
import { Login } from './Login.tsx';
import { Home } from './Home.tsx';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
        <Route path="/scanner" element={<QrScannerPage />}/>
        <Route path="/" element={<Login />}/>
        <Route path="/home" element={<Home />}/>
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
