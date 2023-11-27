
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { useAuth } from './AuthContext'; // Импортируем контекст аутентификации
import './LoginPage.css';

Modal.setAppElement('#root');

function LoginPage() {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
  });

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login, setUser } = useAuth(); // Обновлено: используем setUser из контекста
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Отправляем запрос аутентификации
      const authResponse = await axios.post('https://localhost:7093/api/Userr/authenticate', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (authResponse.status === 200 && authResponse.data.token) {
        // Сохраняем токен в localStorage
        localStorage.setItem('token', authResponse.data.token);
  
        // Получаем информацию о пользователе по номеру телефона
        const userResponse = await axios.get(`https://localhost:7093/api/Userr/${formData.phoneNumber}`, {
          headers: {
            Authorization: `Bearer ${authResponse.data.token}`,
          },
        });
  
        if (userResponse.status === 200) {
          const userFirstName = userResponse.data.firstName;
          const userLastName = userResponse.data.lastName;
          const userdob = userResponse.data.dob.split('T')[0];;
          const phoneNumber = userResponse.data.phoneNumber;
          const userId = userResponse.data.userId;
          const userRoleId = userResponse.data.roleId;

  
          // Используем функцию login из контекста аутентификации
          login({ name: userFirstName, lastName: userLastName, userDob: userdob, PhoneNumber: phoneNumber, userid: userId,roleId: userRoleId});
  
          if (userRoleId === 3) {
            navigate('/EmployeePage');
          }
          else if (userRoleId === 2) {
            navigate('/AdminPanel');
          } 
          else {
            navigate('/MenuPage');
          }
        } else {
          console.error('Ошибка получения информации о пользователе');
          setErrorMessage('Ошибка при получении информации о пользователе');
          setIsErrorModalOpen(true);
        }
      } else {
        console.error('Ошибка аутентификации');
        setErrorMessage('Неправильный логин или пароль');
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса аутентификации:', error);
  
      if (error.response) {
        setErrorMessage('Неправильный логин или пароль');
        setIsErrorModalOpen(true);
      }
    }
  };

  return (
    <div className="login-form">
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="phoneNumber">Номер телефона:</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Войти" />
          <button className="back-button">
            <i className="fas fa-arrow-left">
              <Link to="/MenuPage">Назад</Link>
            </i>
          </button>
        </div>
        <button className="register-button">
          <Link to="/RegistrationPage">Зарегистрироваться</Link>
        </button>
      </form>

      <Modal
        isOpen={isErrorModalOpen}
        onRequestClose={() => setIsErrorModalOpen(false)}
        contentLabel="Ошибка аутентификации"
        style={{
          content: {
            width: '300px',
            margin: 'auto',
            height: '100px',
          },
        }}
      >
        <div>
          <p>{errorMessage}</p>
          <button onClick={() => setIsErrorModalOpen(false)}>Закрыть</button>
        </div>
      </Modal>
    </div>
  );
}

export default LoginPage;
