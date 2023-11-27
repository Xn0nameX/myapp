import React, { useState, useEffect } from 'react';
import './AdminPanel.css'; 
import {  useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminPage = () => {
    const { logout,user } = useAuth(); // ваш хук для управления авторизацией
  const [allUserOrders, setAllUserOrders] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [averageOrderTotal, setAverageOrderTotal] = useState("");
  const navigate = useNavigate();
  const [mostPopularProduct, setMostPopularProduct] = useState("");

  const [statusOptions, setStatusOptions] = useState([
    { id: 1, value: 'В обработке' },
    { id: 2, value: 'Готовиться' },
    { id: 3, value: 'Готов' },
    { id: 4, value: 'Возврат' },
]);
let totalSum = parseFloat(localStorage.getItem('totalSum')) || 0;
let ordersCount = parseInt(localStorage.getItem('ordersCount')) || 0;
const fetchMostPopularProduct = async () => {
    try {
        const response = await fetch("https://localhost:7093/api/Orders/api/orders/most-popular-product");
        if (!response.ok) {
            throw new Error("Error fetching most popular product");
        }
        const data = await response.json();
        setMostPopularProduct(data.mostPopularProduct);
        localStorage.setItem('mostPopularProduct', data.mostPopularProduct);
    } catch (error) {
        console.error("Error fetching most popular product:", error.message);
    }
};
useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем список всех пользователей
        const usersResponse = await fetch('https://localhost:7093/api/Userr');
  
        if (!usersResponse.ok) {
          const errorText = await usersResponse.text();
          console.error('Ошибка получения пользователей:', errorText);
          return;
        }
  
        const users = await usersResponse.json();
  
        // Для каждого пользователя с определенным idrole получаем список заказов
        const allUserOrders = await Promise.all(
          users.map(async (user) => {
            // Проверяем idrole пользователя
            if (user.roleId !== 1) {
              // Если idrole не равен 1, пропускаем пользователя
              return { userId: user.userId, orders: [] };
            }
  
            const userId = user.userId;
            const ordersResponse = await fetch(`https://localhost:7093/api/Userr/${userId}/orders`);
  
            if (ordersResponse.ok) {
              const orders = await ordersResponse.json();
              return { userId, orders };
            } else if (ordersResponse.status === 404) {
              // Если заказов нет, возвращаем пустой массив
              return { userId, orders: [] };
            } else {
              const errorText = await ordersResponse.text();
              console.error(`Ошибка получения заказов для пользователя ${userId}:`, errorText);
              throw new Error(`Ошибка получения заказов для пользователя ${userId}`);
            }
          })
        );
        fetchMostPopularProduct();
        console.log(setMostPopularProduct)
        // Обновляем состояние с заказами всех пользователей
        setAllUserOrders(allUserOrders);
        setMostPopularProduct(findMostPopularProducts(allUserOrders.flat()));
      } catch (error) {
        console.error('Ошибка получения пользователей или заказов:', error.message);
      }
    };
  
    if (user) {
      fetchData();
    }
  }, [user]);
  
  const getStatusIdByName = (statusName) => {
    console.log(statusName)
    const selectedStatus = statusOptions.find((status) => status.id === statusName);
    console.log('Selected status:', selectedStatus);

    return selectedStatus ? selectedStatus.id : 1; // или любое значение по умолчанию
};


const handleLogout = () => {
    // Очищаем данные в localStorage и выходим
    logout();
    
    // Перенаправляем пользователя на страницу входа
    navigate('/LoginPage');
  };
 
  const calculateOrderTotal = (order) => {
    if (order && order.orderItems) {
      let count_ord = order.orderItems.reduce((total, item) => total + item.menuItemPrice, 0);
      totalSum += count_ord;
      ordersCount += 1;
      return count_ord;
    } else {
      return 0;
    }
  };
const handleChangeStatus = async () => {
    if (selectedOrder && newStatus) {
        try {
            const statusId = getStatusIdByName(newStatus);
            console.log('Sending statusId:', statusId);
            const response = await fetch(`https://localhost:7093/api/Orders/${selectedOrder.orderId}?statusId=${statusId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    StatusId: statusId,
                }),
            });

            if (response.ok) {
                setSelectedOrder({
                    ...selectedOrder,
                    statusId: statusId,
                });
                navigate();
            } else {
                const errorText = await response.text();
                console.error('Ошибка изменения статуса заказа:', errorText);
            }
        } catch (error) {
            console.error('Ошибка изменения статуса заказа:', error.message);
        }
    }
};
const findAllOrderProducts = (orders) => {
    const allOrderProducts = [];
  
    // Перебираем все заказы и продукты в них
    orders.forEach((order) => {
      // Проверяем, существует ли свойство orderItems и является ли его тип массивом
      if (order && order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach((item) => {
          allOrderProducts.push(item);
        });
      }
    });
  
    return allOrderProducts;
};
const AverageOrderTotal = () => {
    const average = ordersCount === 0 ? 0 : totalSum / ordersCount;
    
    // Сохраняем данные в localStorage
    fetchMostPopularProduct();
    localStorage.setItem('totalSum', totalSum);
    localStorage.setItem('ordersCount', ordersCount);
    navigate();

    // Используйте setAverageOrderTotal для обновления состояния
    setAverageOrderTotal(average);

    return average;
};

  const findMostPopularProducts = (orders) => {
    const productCounts = {};
  
    // Подсчитываем количество каждого продукта
    orders.forEach((order) => {
      if (order && order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach((item) => {
          if (productCounts[item.menuItemName]) {
            productCounts[item.menuItemName]++;
          } else {
            productCounts[item.menuItemName] = 1;
          }
        });
      }
    });
  
    // Находим самые популярные продукты
    const maxCount = Math.max(...Object.values(productCounts));
    const mostPopularProducts = Object.entries(productCounts)
      .filter(([productName, count]) => count === maxCount)
      .map(([productName]) => productName);
  
    return mostPopularProducts;
  };
  const handleMostPopularProductChange = (newMostPopularProduct) => {
    console.log('Новый популярный продукт:', newMostPopularProduct);
  
    // Сохранение в localStorage
    localStorage.setItem('mostPopularProduct', newMostPopularProduct);
  
    // Обновление состояния
    setMostPopularProduct(newMostPopularProduct);
  };

  return (
    <div className="container">
      <h1>Администраторская страница</h1>
      <p>Добро пожаловать, {user && user.name}!</p>
      <div>
            <p>Средняя стоимость чека: {totalSum/ordersCount}</p>
          </div>
          <div>
            <p>Самый популярный продукт: {mostPopularProduct || "Нет данных"}</p>
          </div>
          <button onClick={AverageOrderTotal}>Обновить данные</button>
  
      {/* Вывод списка заказов */}
      {allUserOrders.length > 0 ? ( // Добавлено условие
        <table>
          <thead>
            <tr>
              <th>ID заказа</th>
              <th>Элементы заказа</th>
              <th>Стоимость заказа</th> {/* Новый столбец */}
              <th>Текущий статус</th>
            </tr>
          </thead>
          <tbody>
            {allUserOrders.map((userOrders) =>
              userOrders.orders.map((order) => (
                <tr key={order.orderId} onClick={() => setSelectedOrder(order)}>
                  <td>{order.orderId}</td>
                  <td>
                    <ul>
                      {order.orderItems.map((item) => (
                        <li key={item.menuItemId}>
                          {item.menuItemName} - {item.menuItemPrice}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{calculateOrderTotal(order)}</td> {/* Новая ячейка для стоимости заказа */}
                  <td>{order.orderStatus}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <p>Загрузка данных...</p>
      )}
      
  
      {/* Форма для изменения статуса */}
      {selectedOrder && (
        <div>
          <h2>Изменение статуса заказа #{selectedOrder.orderId}</h2>
          <select
            value={newStatus}
            onChange={(e) => {
              const selectedValue = parseInt(e.target.value, 10);
              console.log("Selected value:", selectedValue);
              setNewStatus(selectedValue);
            }}
          >
            {statusOptions.map((status) => (
              <option key={status.id} value={status.id}>
                {status.value}
              </option>
            ))}
          </select>
          <button onClick={() => handleChangeStatus()}>Применить</button>
          
        </div>
      )}
  
      {/* Кнопка выхода */}
      <button onClick={handleLogout} className='login-button'>Выход</button>
    </div>
  );
}

export default AdminPage;
