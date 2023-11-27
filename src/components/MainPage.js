import React from 'react';
import './MainPage.css';
import logo from './icon_kafe.png';
import cartIcon from './korzina.png';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { useAuth } from './AuthContext';
function MainPage() {
  const contactsRef = useRef(null);
  const { user, logout } = useAuth(); // Используем контекст аутентификации

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
        <main>
        <div className="big-rectangle main-rectangle">
        
            <h2>История создания</h2>
            <p>Идея которого зародилась ещё в студенческие годы.</p>
            <p>Насыщенные обсуждениями лекций и заданий, они всегда находили утешение в чашке ароматного кофе. </p>
            <p>Со временем эта привычка переросла в страсть к кофе и желание поделиться ею со всем миром.</p>
            <p> Они стали исследовать разнообразие зерен, методы обжарки и приготовления. </p>
            <p>
               Их страсть к кофе объединила их, и они решили создать своё уютное пространство, </p>
            <p>чтобы делиться своим вдохновением, культурой и любовью к кофе с другими людьми. </p>
            <p>Это стало началом кофейни Kofeshka.</p>       
        </div>
        <div className="wrapper">
          <div className="small-rectangle main-rectangle">
            <h2>Бессмертная классика</h2>  <h3>Латте</h3>
          
            <p>Т1 чашка кофе (2 унции)</p>
            <p>1 чашка молока (2 унции)</p>
            <p>1-2 чайные ложки сахара или другого подсластителя (по желанию)</p>
            <h3>Приготовление</h3>
            <p>Варите эспрессо или сильный кофе, достаточный для одной чашки (2 унции).</p>
            <p> Закипятите молоко в кастрюле </p>
            <p>чтобы вспенить молоко до образования мягкой пены.</p>
            <p>Налейте эспрессо или кофе в чашку, добавьте вспененное молоко.</p>
            <p>По желанию, посыпьте поверх ложку вспененного молока </p>
            <p>или обсыпьте корицей.</p>
          </div>
          <div className="small-rectangle main-rectangle">
            <h1>Акции</h1>
            <h2>&shy;</h2>
            <h2>Скидка на десерты для посетителей </h2>
            <h2>до 16:00</h2>
            <h2>&shy;</h2>
            <h2>Кофе с пониженной ценой по четвергам</h2>
          </div>
        </div>
      </main> 
      <div className="separator_footer"></div>
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
  
  export default MainPage;