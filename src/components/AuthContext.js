import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Проверяем, есть ли имя пользователя в localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    // Выполните логику входа, если это необходимо
    setUser(userData);
    // Сохраняем имя пользователя в localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    // Выполните логику выхода, если это необходимо
    setUser(null);
    // Удаляем имя пользователя из localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('totalSum');
    localStorage.removeItem('ordersCount');
    
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
