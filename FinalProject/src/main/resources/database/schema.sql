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
