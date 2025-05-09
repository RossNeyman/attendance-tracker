import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import { QrScannerPage } from './pages/QrScannerPage.tsx';
import { store } from './app/store';
import { Login } from './pages/LoginPage.tsx';
import { Home } from './pages/HomePage.tsx';
import { SignupPage } from './pages/SignupPage.tsx';
import { ForgotPassword } from './pages/ForgotPasswordPage.tsx';
import {ResetPassword} from './pages/ResetPasswordPage.tsx';
import Logs from './pages/ShowLogsForRoomPage.tsx';
import { AccountSettings } from './pages/AccountSettingsPage.tsx';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/account" element={<AccountSettings />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/scanner/:userId/:roomId" element={<QrScannerPage />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logs/:roomId/:userId" element={<Logs />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App;