-- V1__init.sql
-- Initial schema setup for stadium parking system

CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20)
);

CREATE TABLE parking_spots (
    id UUID PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    available BOOLEAN DEFAULT TRUE
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    spot_id UUID REFERENCES parking_spots(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL
);