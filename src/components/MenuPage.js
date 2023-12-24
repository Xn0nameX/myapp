
import React, { useState, useEffect, useRef } from 'react';
import './MenuPage.css'; 
import './MainPage.css';
import logo from './icon_kafe.png';
import cartIcon from './korzina.png';
import latteImage from './latte.jpg';
import kapuchinoImage from './kapuchino.jpg';
import americanoImage from './americano.jpg';
import espressoImage from './espresso.jpg';
import mokkoImage from './mokko.jpg';
import cheescakeImage from './cheescake.jpeg';
import kryasanImage from './kryasan.jpg';
import fruitsalatImage from './fruit_salat.png';
import pancakeImage from './pancake.jpg';
import { Link , useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';
const menuItems = [
  { id: 1, name: 'Кофе Латте', description: 'Нежный латте с великолепным ароматом',price: 99, image: latteImage },
  { id: 2, name: 'Капучино', description: 'Ароматный капучино с пышной пенкой',price: 89, image: kapuchinoImage },
  { id: 3, name: 'Американо', description: 'Крепкий американо с насыщенным вкусом',price: 69, image: americanoImage },
  { id: 4, name: 'Эспрессо', description: 'Классическое эспрессо для настоящих ценителей',price: 89, image: espressoImage },
  { id: 5, name: 'Мокко', description: 'Восхитительный мокко с добавлением шоколада',price: 100, image: mokkoImage },
  { id: 6, name: 'Чизкейк', description: 'Нежный чизкейк с сочными ягодами',price: 120, image: cheescakeImage },
  { id: 7, name: 'Круассан с лососем', description: 'Ароматный круассан с копчёным лососем',price: 100, image: kryasanImage },
  { id: 8, name: 'Фруктовый салат', description: 'Свежий фруктовый салат с мятным соусом',price: 150, image: fruitsalatImage },
  { id: 9, name: 'Панкейки с кленовым сиропом', description: 'Пушистые панкейки с кленовым сиропом',price: 200, image: pancakeImage },
];
function MenuPage() {
  const [cartItems, setCartItems] = useState([]);
  const contactsRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: 'smooth',
    });
  };

  const addToCart = (item) => {
    if (!user) {
      navigate('/LoginPage');
      return; // Останавливаем выполнение функции, чтобы корзина не изменялась
    }
    const updatedCart = [...cartItems, { ...item, quantity: 1 }];
    setCartItems(updatedCart);
  };

  useEffect(() => {
    // При монтировании компонента, считываем данные из localStorage
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems((prevCartItems) => [...prevCartItems, ...storedCartItems]);
  }, []); // [] означает, что useEffect вызывается только при монтировании компонента

  useEffect(() => {
    // Сохранение корзины в localStorage при каждом изменении
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    console.log('Cart Items:', cartItems);
  }, [cartItems]);
    return (
      <div className="main">
       <header>
       <div className="logo">
        <Link to="/">
          <img src={logo} alt="Kafe icon" className="image_kafe" />
        </Link>
      </div>
      <div className="cafe-name">Kofeshka</div>
      <nav>
        <ul className="other-font">
          <li className="bigger-size">
            <a href="#reserve" onClick={() => scrollToSection(contactsRef)} className="menu-link">
              Бронь столика
            </a>
          </li>
          <li>
            <Link to="/MenuPage">Меню</Link>
          </li>
          <li>
            <a href="#about" onClick={() => scrollToSection(contactsRef)} className="menu-link">
              О нас
            </a>
          </li>
          <li>
            <a href="#contacts" onClick={() => scrollToSection(contactsRef)} className="menu-link">
              Контакты
            </a>
          </li>
          <li>
           
          </li>
          {user ? (
            // Если пользователь вошел, отображаем его имя и кнопку выхода
            <>
               
               <li>
                <Link to="/UserProfile">Добро пожаловать, {user.name}!</Link>
              </li>
              
              <li>
                <Link to="/CartPage">
                  <img src={cartIcon} alt="Cart icon" className="image_korzina" />
                </Link>
              </li>
              <button onClick={logout} className="login-button">
                Выйти
              </button>
            </>
          ) : (
            // Если пользователь не вошел, отображаем кнопку входа
            <li>
               <Link to="/LoginPage" className="login-button">
                Вход
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
    <main>
        <div className="menu-section">
          {menuItems.map((item) => (
            <div className="menu-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <button
                className="add-to-cart-button"
                onClick={() => addToCart(item)}
              >
                Добавить в корзину
              </button>
            </div>
          ))}
        </div>
      </main>
      <footer className="footer">
        <div className="coffee-info">
          <h2>О нас</h2>
          <p>Кофейня Kafeshka рада предложить вам лучший кофе в уютной атмосфере. Мы специализируемся на великолепных сортах кофе и уникальных напитках.</p>
        </div>

        <div className="contact-info">
        <section ref={contactsRef} id="contacts">
        <h3>Контакты</h3>
          <p>Адрес: ул. Примерная, д. 123</p>
          <p>Телефон: +7 123 456-78-90</p>
          <p>Email: info@kafeshka.com</p>
          <p>Забронировать столик можно по номеру +7123456789</p>
        </section> 
        </div>
      </footer>
    </div>
  );
}
export default MenuPage;
