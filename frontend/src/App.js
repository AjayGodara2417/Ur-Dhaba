import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Footer from './components/Footer/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import { store } from './redux/store';
// import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import pages (to be created)
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RestaurantList from './components/RestaurantList/RestaurantList';
import RestaurantDetail from './pages/restaurant/RestaurantDetail';
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import Profile from './pages/user/Profile';
import Orders from './pages/user/Orders';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
  },
  spacing: 8, // Base spacing unit
});

function App() {
  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <div className="app">
              <Navbar />
              {/* <Layout> */}
                <Routes>
                  <Route path="/" element={
                    <>
                      <Hero />
                      <Home />
                    </>
                  } />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/restaurants" element={<RestaurantList />} />
                  <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                  <Route 
                    path="/cart" 
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/checkout" 
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders" 
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/restaurant-dashboard" 
                    element={
                      <ProtectedRoute>
                        <RestaurantDashboard />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              {/* </Layout> */}
              <Footer />
            </div>
          </Router>
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>
  );
}

export default App;
