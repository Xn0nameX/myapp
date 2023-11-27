import React, { useState, useEffect } from 'react';
import './EmployeePage.css'; 
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
const EmployeePage = () => {
    const { user } = useAuth();
  const [allUserOrders, setAllUserOrders] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const {  logout } = useAuth(); // Используем контекст аутентификации

  const [statusOptions, setStatusOptions] = useState([
    { id: 1, value: 'В обработке' },
    { id: 2, value: 'Готовиться' },
    { id: 3, value: 'Готов' },
    { id: 4, value: 'Возврат' },
]);
  
  useEffect(() => {
    const fetchAllUserOrders = async () => {
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
            if (user.roleId
                !== 1) {
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
  
        // Обновляем состояние с заказами всех пользователей
        setAllUserOrders(allUserOrders);
      } catch (error) {
        console.error('Ошибка получения пользователей или заказов:', error.message);
      }
    };
  
    if (user) {
      fetchAllUserOrders();
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
  
return (
    <div className="container">
      <div style={{ marginLeft: '20px' }}>
        {/* Вывод списка заказов */}
        <table>
          <thead>
            <tr>
              <th>ID заказа</th>
              <th>Элементы заказа</th>
              <th>Текущий статус</th>
              <th>Изменение статуса</th>
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
                  <td>{order.orderStatus}</td>
                  <td>
                    <div>
                      <h1>Изменение статуса заказа #{order.orderId}</h1>
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button onClick={handleLogout} className='login-button'>Выход</button>
    </div>
  );
  };
  
  export default EmployeePage;

  