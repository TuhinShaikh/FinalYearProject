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

