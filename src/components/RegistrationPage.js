import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegistrationPage.css';
import './MainPage.css';


function RegistrationPage() {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    DateOfBirth: '',
  });
  const navigate = useNavigate(); // Хук для управления навигацией

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Преобразовываем формат DateOfBirth в 'yyyy-mm-dd'
    const formattedDate = new Date(formData.DateOfBirth).toISOString();
  
    // Добавляем текущее время в объект formData
    const formDataWithTime = { ...formData, createdAt: new Date().toJSON(), DateOfBirth: formattedDate };
  
    try {
      const response = await axios.post('https://localhost:7093/api/Userr', formDataWithTime, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log(response.data);
  
      // Обработка успешной регистрации, например, перенаправление на другую страницу
      navigate('/LoginPage');
    } catch (error) {
      console.log(error.response.data.errors);
      console.error('Ошибка регистрации:', formData.DateOfBirth);
      // Другие действия по обработке ошибки
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <div className="registration-form">
        <form onSubmit={handleSubmit}>

          <label htmlFor="username">Никнейм:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required /><br /><br />

          <label htmlFor="firstName">Имя:</label>
          <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required /><br /><br />

          <label htmlFor="lastName">Фамилия:</label>
          <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required /><br /><br />

          <label htmlFor="phoneNumber">Номер телефона:</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" pattern="[0-9]{1}[0-9]{3}[0-9]{3}[0-9]{4}" value={formData.phoneNumber} onChange={handleChange} required /><br /><br />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /><br /><br />

          <label htmlFor="password">Пароль:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required /><br /><br />

          <label htmlFor="DateOfBirth">Дата рождения:</label>
          <input type="date" id="DateOfBirth" name="DateOfBirth" value={formData.DateOfBirth} onChange={handleChange} required /><br /><br />

          <div className="form-group">
            <input type="submit" value="Зарегистрироваться" />
            <button className="back-button">
              <i className="fas fa-arrow-left"><Link to="/LoginPage">Назад</Link></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;