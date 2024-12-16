-- Создаем таблицу авиакомпаний
CREATE TABLE IF NOT EXISTS Airlines (
    AirlineID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    AirlineCode VARCHAR(10) NOT NULL UNIQUE,
    Phone VARCHAR(15)
);

-- Создаем таблицу рейсов
CREATE TABLE IF NOT EXISTS Flights (
    FlightID SERIAL PRIMARY KEY,
    FlightNumber VARCHAR(20) NOT NULL UNIQUE,
    Departure VARCHAR(50) NOT NULL,
    Destination VARCHAR(50) NOT NULL,
    DepartureTime TIMESTAMP NOT NULL,
    ArrivalTime TIMESTAMP NOT NULL,
    Price NUMERIC(10, 2) NOT NULL CHECK (Price > 0),
    AirlineID INT REFERENCES Airlines(AirlineID) ON DELETE CASCADE
);

-- Создаем таблицу пассажиров
CREATE TABLE IF NOT EXISTS Passengers (
    PassengerID SERIAL PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    PassportNumber VARCHAR(20) NOT NULL UNIQUE,
    BirthDate DATE NOT NULL,
    Phone VARCHAR(15)
);

-- Создаем таблицу билетов
CREATE TABLE IF NOT EXISTS Tickets (
    TicketID SERIAL PRIMARY KEY,
    TicketNumber VARCHAR(20) NOT NULL UNIQUE,
    PassengerID INT REFERENCES Passengers(PassengerID) ON DELETE CASCADE,
    FlightID INT REFERENCES Flights(FlightID) ON DELETE CASCADE,
    PurchaseDate TIMESTAMP NOT NULL DEFAULT NOW(),
    Seat VARCHAR(10)
);