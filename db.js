const { Client } = require('pg');

// Настройки подключения
const client = new Client({
  user: 'postgres', // Имя пользователя PostgreSQL
  host: 'localhost', // Адрес сервера PostgreSQL
  database: 'airline_tickets', // Имя базы данных
  password: '1488', // Пароль пользователя
  port: 5432, // Порт PostgreSQL
});

// Подключение к базе данных
client.connect()
  .then(() => console.log('Подключение к базе данных успешно установлено'))
  .catch(err => console.error('Ошибка подключения к базе данных:', err.stack));

// Функция для выполнения SQL-запросов
async function executeQuery(query, params = []) {
  try {
    const res = await client.query(query, params);
    return res.rows;
  } catch (err) {
    console.error('Ошибка выполнения SQL-запроса:', err.stack);
  }
}

// Закрытие соединения
async function closeConnection() {
  await client.end();
  console.log('Подключение к базе данных закрыто.');
}

module.exports = { executeQuery, closeConnection };