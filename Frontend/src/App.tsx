import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import { QrScannerPage } from './QrScannerPage.tsx';
import { store } from './app/store';
import { Login } from './Login.tsx';
import { Home } from './Home.tsx';
import { Signup } from './Signup.tsx';
import { ForgotPassword } from './forgotPassword.tsx';
import {ResetPassword} from './resetPassword.tsx';
import Logs from './Logs.tsx';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/scanner/:userId/:roomId" element={<QrScannerPage />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logs/:roomId/:userId" element={<Logs />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App;