DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public;

SET search_path = public;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    model VARCHAR(255) NOT NULL,
    number VARCHAR(255) UNIQUE NOT NULL,
    status BOOLEAN
);

CREATE TABLE reservation (
    id SERIAL PRIMARY KEY,
    userId INTEGER,
    carId INTEGER,
    startDate DATE,
    endDate DATE,
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(carId) REFERENCES cars(id)
);