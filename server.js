const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { executeQuery, closeConnection } = require('./db'); // ваш модуль db.js

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Общая функция для обработки ошибок
const handleError = (res, err) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ошибка выполнения запроса' });
};

// Получить всех пассажиров
app.get('/api/passengers', async (req, res) => {
  try {
    const query = 'SELECT * FROM Passengers;';
    const result = await executeQuery(query);
    res.json(result);
  } catch (err) {
    handleError(res, err);
  }
});

// Добавить пассажира
app.post('/api/passengers', async (req, res) => {
  const { fullName, passportNumber, birthDate, phone } = req.body;

  try {
    // Проверка на уникальность номера паспорта
    const checkQuery = 'SELECT * FROM Passengers WHERE PassportNumber = $1;';
    const checkResult = await executeQuery(checkQuery, [passportNumber]);

    if (checkResult.length > 0) {
      return res.status(400).json({ error: 'Пассажир с таким номером паспорта уже существует.' });
    }

    // Добавить нового пассажира
    const query = `
      INSERT INTO Passengers (FullName, PassportNumber, BirthDate, Phone)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const result = await executeQuery(query, [fullName, passportNumber, birthDate, phone]);

    res.json(result[0]);
  } catch (err) {
    handleError(res, err);
  }
});

// Удалить пассажира
app.delete('/api/passengers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM Passengers WHERE PassengerID = $1 RETURNING *;';
    const result = await executeQuery(query, [id]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Пассажир не найден' });
    }

    res.json(result[0]);
  } catch (err) {
    handleError(res, err);
  }
});

// Получить все авиакомпании
app.get('/api/airlines', async (req, res) => {
  try {
    const query = 'SELECT * FROM Airlines;';
    const result = await executeQuery(query);
    res.json(result);
  } catch (err) {
    handleError(res, err);
  }
});

// Добавить авиакомпанию
app.post('/api/airlines', async (req, res) => {
  const { name, airlineCode, phone } = req.body;

  try {
    const query = `
      INSERT INTO Airlines (Name, AirlineCode, Phone)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const result = await executeQuery(query, [name, airlineCode, phone]);

    res.json(result[0]);
  } catch (err) {
    handleError(res, err);
  }
});

// Удалить авиакомпанию
app.delete('/api/airlines/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM Airlines WHERE AirlineID = $1 RETURNING *;';
    const result = await executeQuery(query, [id]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Авиакомпания не найдена' });
    }

    res.json(result[0]);
  } catch (err) {
    handleError(res, err);
  }
});

// Получить все рейсы
app.get('/api/flights', async (req, res) => {
  try {
    const query = 'SELECT * FROM Flights;';
    const result = await executeQuery(query);
    res.json(result);
  } catch (err) {
    handleError(res, err);
  }
});

// Добавить рейс
app.post('/api/flights', async (req, res) => {
  const { flightNumber, departure, destination, departureTime, arrivalTime, price, airlineId } = req.body;

  try {
    const query = `
      INSERT INTO Flights (FlightNumber, Departure, Destination, DepartureTime, ArrivalTime, Price, AirlineID)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const result = await executeQuery(query, [flightNumber, departure, destination, departureTime, arrivalTime, price, airlineId]);

    res.json(result[0]);
  } catch (err) {
    handleError(res, err);
  }
});

// Удалить рейс
app.delete('/api/flights/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM Flights WHERE FlightID = $1 RETURNING *;';
    const result = await executeQuery(query, [id]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Рейс не найден' });
    }

    res.json(result[0]);
  } catch (err) {
    handleError(res, err);
  }
});

// Получить все билеты
app.get('/api/tickets', async (req, res) => {
  try {
    const query = 'SELECT * FROM Tickets;';
    const result = await executeQuery(query);
    res.json(result);
  } catch (err) {
    handleError(res, err);
  }
});

// Добавить билет
app.post('/api/tickets', async (req, res) => {
  const { ticketNumber, passengerId, flightId, seat } = req.body;

  try {
    const query = `
      INSERT INTO Tickets (TicketNumber, PassengerID, FlightID, Seat)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const result = await executeQuery(query, [ticketNumber, passengerId, flightId, seat]);

    res.json(result[0]);
  } catch (err) {
    handleError(res, err);
  }
});

// Удалить билет
app.delete('/api/tickets/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM Tickets WHERE TicketID = $1 RETURNING *;';
    const result = await executeQuery(query, [id]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Билет не найден' });
    }

    res.json(result[0]);
  } catch (err) {
    handleError(res, err);
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
