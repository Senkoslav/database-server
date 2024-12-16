const fs = require('fs');
const { executeQuery, closeConnection } = require('./db');

// Функция для создания структуры базы данных
async function createDatabaseSchema() {
  try {
    // Считываем SQL-скрипт из файла schema.sql
    const schema = fs.readFileSync('./schema.sql', 'utf8');
    // Выполняем SQL-скрипт
    await executeQuery(schema);
    console.log('Структура базы данных успешно создана.');
  } catch (err) {
    console.error('Ошибка при создании структуры базы данных:', err.stack);
  }
}

// Пример добавления пассажира
async function addPassenger(fullName, passportNumber, birthDate, phone) {
  const query = `
    INSERT INTO Passengers (FullName, PassportNumber, BirthDate, Phone)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  const result = await executeQuery(query, [fullName, passportNumber, birthDate, phone]);
  console.log('Добавлен пассажир:', result);
}

// Пример выборки всех пассажиров
async function getAllPassengers() {
  const query = `SELECT * FROM Passengers;`;
  const passengers = await executeQuery(query);
  console.log('Список пассажиров:');
  passengers.forEach(passenger => {
    console.log(`ID: ${passenger.passengerid}, ФИО: ${passenger.fullname}, Номер паспорта: ${passenger.passportnumber}, Дата рождения: ${passenger.birthdate}, Телефон: ${passenger.phone}`);
  });
}

// Пример выборки всех авиакомпаний
async function getAllAirlines() {
  const query = `SELECT * FROM Airlines;`;
  const airlines = await executeQuery(query);
  console.log('Список авиакомпаний:');
  airlines.forEach(airline => {
    console.log(`ID: ${airline.airlineid}, Название: ${airline.name}, Код: ${airline.airlinecode}, Телефон: ${airline.phone}`);
  });
}

// Пример выборки всех рейсов
async function getAllFlights() {
  const query = `SELECT * FROM Flights;`;
  const flights = await executeQuery(query);
  console.log('Список рейсов:');
  flights.forEach(flight => {
    console.log(`ID: ${flight.flightid}, Номер рейса: ${flight.flightnumber}, Откуда: ${flight.departure}, Куда: ${flight.destination}, Время вылета: ${flight.departuretime}, Время прибытия: ${flight.arrivaltime}, Цена: ${flight.price}`);
  });
}

// Пример выборки всех билетов
async function getAllTickets() {
  const query = `SELECT * FROM Tickets;`;
  const tickets = await executeQuery(query);
  console.log('Список билетов:');
  tickets.forEach(ticket => {
    console.log(`ID: ${ticket.ticketid}, Номер билета: ${ticket.ticketnumber}, Пассажир ID: ${ticket.passengerid}, Рейс ID: ${ticket.flightid}, Место: ${ticket.seat}`);
  });
}

// Основная функция
async function main() {
  // Создаем структуру базы данных
//   await createDatabaseSchema();

  // Добавляем тестовые данные
//   await addPassenger('Иван Иванов', '1234567890', '1990-01-01', '+79991112233');
//   await addPassenger('Мария Петрова', '0987654321', '1985-05-15', '+79992223344');

  // Получаем список всех пассажиров
  await getAllPassengers();

  // Получаем список всех авиакомпаний
  await getAllAirlines();

  // Получаем список всех рейсов
  await getAllFlights();

  // Получаем список всех билетов
  await getAllTickets();

  // Закрываем подключение
  await closeConnection();
}

// Запуск программы
main();
