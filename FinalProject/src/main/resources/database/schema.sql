-- Stadium Parking & Transport Management System
-- PostgreSQL Database Schema
-- Created: October 2025

-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS accessibility_preferences CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS parking_spots CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS parking_spot_type CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS text_size CASCADE;

-- Create ENUM types
CREATE TYPE parking_spot_type AS ENUM ('standard', 'accessible', 'premium');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE text_size AS ENUM ('small', 'medium', 'large', 'extra-large');

-- ====================================
-- USERS TABLE
-- ====================================
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    is_disabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ====================================
-- PARKING SPOTS TABLE
-- ====================================
CREATE TABLE parking_spots (
    spot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spot_number VARCHAR(10) NOT NULL UNIQUE,
    type parking_spot_type NOT NULL DEFAULT 'standard',
    is_available BOOLEAN DEFAULT TRUE,
    price_per_hour DECIMAL(10, 2) NOT NULL,
    location_description TEXT,
    floor_level INTEGER,
    is_covered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT positive_price CHECK (price_per_hour > 0),
    CONSTRAINT valid_floor CHECK (floor_level >= -2 AND floor_level <= 10)
);

-- Create indexes for frequent queries
CREATE INDEX idx_parking_spots_type ON parking_spots(type);
CREATE INDEX idx_parking_spots_available ON parking_spots(is_available);
CREATE INDEX idx_parking_spots_type_available ON parking_spots(type, is_available);
