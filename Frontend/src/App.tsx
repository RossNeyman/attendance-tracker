import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  // Import useLocation
} from 'react-router-dom';
// import reactLogo from './assets/react.svg' // Currently unused
// import viteLogo from '/vite.svg'      // Currently unused
import { QrScannerPage } from './QrScannerPage.tsx';
// import { StudentQRCode } from './components/StudentQrCode.tsx'; // Currently unused in Routes
import { store } from './app/store';
import { Login } from './Login.tsx';
import { Home } from './Home.tsx';
import { Signup } from './Signup.tsx';



// --- Create a Layout component to manage NavBar visibility ---
// function Layout() {
//  // const location = useLocation(); // Get the current location object
//  // const showNavBar = location.pathname !== '/'; // Show NavBar if path is NOT the root '/' (which is your Login page)

//   return (
//     <>
//       {/* Conditionally render the NavBar */}
      

//       {/* Define the routes where the page content will be rendered */}
      
//     </>
//   );
// }


// --- Updated App component ---
function App() {
  return (
    // Redux Provider wraps everything
    <Provider store={store}>
      {/* Router wraps the Layout */}
      <Router>
        {/* Render the Layout component which handles NavBar and Routes */}
        <Routes>
        <Route path="/scanner" element={<QrScannerPage />} />
        {/* The Login route uses the root path */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        {/* Add any other routes here */}
      </Routes>
      </Router>
    </Provider>
  )
}

export default App;