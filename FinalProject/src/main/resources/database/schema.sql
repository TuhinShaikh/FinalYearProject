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

-- ====================================
-- BOOKINGS TABLE
-- ====================================
CREATE TABLE bookings (
    booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    spot_id UUID NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    version_number INTEGER NOT NULL DEFAULT 0,
    confirmation_code VARCHAR(20) UNIQUE,
    special_requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (spot_id) REFERENCES parking_spots(spot_id) ON DELETE RESTRICT,
    
    CONSTRAINT valid_times CHECK (end_time > start_time),
    CONSTRAINT positive_amount CHECK (total_amount >= 0),
    CONSTRAINT future_booking CHECK (start_time >= CURRENT_TIMESTAMP)
);

-- Create indexes for performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_spot_id ON bookings(spot_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_confirmation ON bookings(confirmation_code);

-- ====================================
-- PAYMENTS TABLE
-- ====================================
CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    square_payment_id VARCHAR(255),
    square_token VARCHAR(255),
    payment_status payment_status NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),
    currency VARCHAR(3) DEFAULT 'GBP',
    processed_at TIMESTAMP,
    refunded_at TIMESTAMP,
    refund_amount DECIMAL(10, 2),
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    
    CONSTRAINT positive_payment_amount CHECK (amount > 0),
    CONSTRAINT valid_refund CHECK (refund_amount IS NULL OR refund_amount <= amount)
);

-- Create indexes
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_square_payment_id ON payments(square_payment_id);
