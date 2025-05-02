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

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/scanner" element={<QrScannerPage />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App;