import {React,useEffect} from 'react';
import './UserProfile.css'; // Создайте файл для стилей
import  { useState } from 'react';
import './MainPage.css';
import logo from './icon_kafe.png';
import cartIcon from './korzina.png';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { useAuth } from './AuthContext';
function UserProfile() {
  const contactsRef = useRef(null);
  const [orderStates, setOrderStates] = useState({});
  const [userOrders, setUserOrders] = useState([]);
  const { user, logout } = useAuth();

  const userIdFromLocalStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).userid : null;

  const toggleOrder = (orderId) => {
    setOrderStates((prevOrderStates) => ({
      ...prevOrderStates,
      [orderId]: !prevOrderStates[orderId],
    }));
  };

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await fetch(`https://localhost:7093/api/Userr/${Number(userIdFromLocalStorage)}/orders`);
        if (response.ok) {
          const orders = await response.json();
          setUserOrders(orders);
        } else {
          const errorText = await response.text();  // Получаем текст ошибки
          console.error('Ошибка получения заказов:', userIdFromLocalStorage);
        }
      } catch (error) {
        console.error('Ошибка получения заказов:', error.message);
      }
    };
  
    if (user) {
      fetchUserOrders();
    }
  }, [user]);
  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: 'smooth',
    });
  };
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
      
    <main className="user-main">
        <div className="user-info">
          <h2>Личный кабинет</h2>
          {/* Здесь выводите информацию о пользователе */}
          <p>Имя: {user ? user.name : 'Нет данных'}</p>
          <p>Фамилия: {user ? user.lastName : 'Нет данных'}</p>
          <p>Номер телефона: {user ? user.PhoneNumber : 'Нет данных'}</p>
          <p>Дата рождения: {user ? user.userDob : 'Нет данных'}</p>
        </div>

        <div className="user-orders">
        <h2>Мои заказы</h2>
        <ul>
          {userOrders.map((order) => (
            <li key={order.orderId}>
              ID заказа {order.orderId}
              <span
                className={`order-details ${orderStates[order.orderId] ? 'open' : ''}`}
                onClick={() => toggleOrder(order.orderId)}
              >
                {orderStates[order.orderId] ? '⮟' : '⮞'} Показать подробности
              </span>
              {orderStates[order.orderId] && (
                <div className="order-content">
                  <p>Содержимое заказа:</p>
                  <ul>
                    {order.orderItems.map((item, index) => (
                      <li key={index}>{`${item.menuItemName} - ${item.menuItemPrice} руб.`}</li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
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

export default UserProfile;
