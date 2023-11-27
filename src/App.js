import {React,useState, useEffect} from 'react';
import MenuPage from './components/MenuPage';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import UserProfile from './components/UserProfile';
import { AuthProvider } from './components/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationPage from './components/RegistrationPage';
import EmployeePage from './components/EmployeePage';
import AdminPanel from './components/AdminPanel';
function App() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Извлечение данных из localStorage при загрузке
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []); // Пустой массив зависимостей означает, что эффект выполнится только один раз при загрузке

  const addToCart = (item) => {
    const updatedCart = [...cartItems, { ...item, quantity: 1 }];
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/EmployeePage" element={<EmployeePage />} />
            <Route path="/AdminPanel" element={<AdminPanel />} />
            <Route path="/" element={<MainPage />} />
            <Route path="/LoginPage/*" element={<LoginPage />} />
            <Route path="/RegistrationPage" element={<RegistrationPage />} />
            <Route path="/MenuPage/*" element={<MenuPage />} />
            <Route path="/CartPage" element={<CartPage />} />
            <Route path="/UserProfile" element={<UserProfile />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
