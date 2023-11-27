import './MainPage.css'; 
import './CartPage.css'; 
import cartIcon from './korzina.png';
import logo from './icon_kafe.png';
import { Link,BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useRef,useEffect } from 'react';
import { useAuth } from './AuthContext';
import React, { useState } from 'react';
import MenuPage from './MenuPage';
const cartItems = [
];
function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const contactsRef = useRef(null);
  const { user, logout } = useAuth();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderStatusId, setOrderStatusId] = useState(1);
  const placeOrder = async () => {
    try {
        const response = await fetch('https://localhost:7093/api/Orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.userid,
                tableId: null,
                orderDate: new Date().toISOString(),
                statusId: 1,
                orderitems: cartItems.map((item) => ({
                    menuItemId: item.id,
                    quantity: item.quantity,
                    itemPrice: item.price,
                    isCompleted: false,
                    note: '',
                })),
            }),
        });

        if (response.ok) {
            console.log('Заказ успешно размещен!');
            setCartItems([]);
            localStorage.removeItem('cartItems');
            setIsOrderPlaced(true); // Устанавливаем состояние, чтобы показать окно
        } else {
            console.error('Ошибка размещения заказа:', response.statusText);
            
            // Добавленный код для вывода текста ответа сервера в случае ошибки
            console.error('Детали ответа:', await response.text());
        }
        setOrderStatusId(1);
    } catch (error) {
        console.error('Ошибка размещения заказа:', error.message);
    }
};
  

  useEffect(() => {
    // При монтировании компонента, считываем данные из localStorage
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
    if (isOrderPlaced) {
      const timeout = setTimeout(() => {
        setIsOrderPlaced(false);
      }, 3000);

      // Очистка таймаута при размонтировании компонента
      return () => clearTimeout(timeout);
    }
  }, [isOrderPlaced]);

  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: 'smooth',
    });
  };

  const increaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    updateLocalStorage(cartItems);
  };

  const decreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
    updateLocalStorage(cartItems);
  };

  const removeFromCart = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    setCartItems(updatedCartItems);
  };

  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
  
    if (existingItem) {
      // Если элемент уже есть в корзине, увеличиваем его количество
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCartItems(updatedCartItems);
      updateLocalStorage(updatedCartItems);
    } else {
      // Если элемента ещё нет в корзине, добавляем его с начальным количеством 1
      const updatedCartItems = [...cartItems, { ...item, quantity: 1 }];
      setCartItems(updatedCartItems);
      updateLocalStorage(updatedCartItems);
    }
  };
  
  const updateLocalStorage = (cartItems) => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  };
  

  

  const total = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

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
        <div className="cart-section">
          {cartItems.length === 0 ? (
            <p>Корзина пуста</p>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">{item.quantity}</span>
                <span className="item-price">{item.price}</span>
                <button onClick={() => removeFromCart(item.id)}>Удалить</button>
              </div>
            ))
          )}
        </div>
        {isOrderPlaced && (
        <div className="order-placed-modal">
          <p>Ваш заказ успешно размещен!</p>
        </div>
      )}

        <div className="total">
          <span className="total-label">Итого:</span>
          <span className="total-amount">{total}</span>
        </div>

        <button className="order-button" onClick={placeOrder}>Оформить заказ</button>
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

export default CartPage;