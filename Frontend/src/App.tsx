import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {QrScanner} from './QrScanner.tsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/scanner" element={<QrScanner />} />
      </Routes>
    </Router>
  )
}

export default App
