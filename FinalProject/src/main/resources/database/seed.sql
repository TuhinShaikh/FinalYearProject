-- Seed Data for Stadium Parking & Transport Management System
-- This file populates the database with test data

-- ====================================
-- SEED PARKING SPOTS
-- ====================================

-- Standard Parking Spots (30 spots)
INSERT INTO parking_spots (spot_number, type, price_per_hour, location_description, floor_level, is_covered) VALUES
('A001', 'standard', 8.50, 'Ground floor near North entrance', 0, FALSE),
('A002', 'standard', 8.50, 'Ground floor near North entrance', 0, FALSE),
('A003', 'standard', 8.50, 'Ground floor near North entrance', 0, FALSE),
('A004', 'standard', 8.50, 'Ground floor near North entrance', 0, FALSE),
('A005', 'standard', 8.50, 'Ground floor near North entrance', 0, FALSE),
('B001', 'standard', 10.00, 'First floor covered parking', 1, TRUE),
('B002', 'standard', 10.00, 'First floor covered parking', 1, TRUE),
('B003', 'standard', 10.00, 'First floor covered parking', 1, TRUE),
('B004', 'standard', 10.00, 'First floor covered parking', 1, TRUE),
('B005', 'standard', 10.00, 'First floor covered parking', 1, TRUE),
('B006', 'standard', 10.00, 'First floor covered parking', 1, TRUE),
('B007', 'standard', 10.00, 'First floor covered parking', 1, TRUE),
('B008', 'standard', 10.00, 'First floor covered parking', 1, TRUE),
('B009', 'standard', 10.00, 'First floor covered parking', 1, TRUE),
('B010', 'standard', 10.00, 'First floor covered parking', 1, TRUE),
('C001', 'standard', 9.00, 'Ground floor near South entrance', 0, FALSE),
('C002', 'standard', 9.00, 'Ground floor near South entrance', 0, FALSE),
('C003', 'standard', 9.00, 'Ground floor near South entrance', 0, FALSE),
('C004', 'standard', 9.00, 'Ground floor near South entrance', 0, FALSE),
('C005', 'standard', 9.00, 'Ground floor near South entrance', 0, FALSE),
('D001', 'standard', 11.00, 'Second floor covered parking', 2, TRUE),
('D002', 'standard', 11.00, 'Second floor covered parking', 2, TRUE),
('D003', 'standard', 11.00, 'Second floor covered parking', 2, TRUE),
('D004', 'standard', 11.00, 'Second floor covered parking', 2, TRUE),
('D005', 'standard', 11.00, 'Second floor covered parking', 2, TRUE),
('E001', 'standard', 8.00, 'Ground floor West side', 0, FALSE),
('E002', 'standard', 8.00, 'Ground floor West side', 0, FALSE),
('E003', 'standard', 8.00, 'Ground floor West side', 0, FALSE),
('E004', 'standard', 8.00, 'Ground floor West side', 0, FALSE),
('E005', 'standard', 8.00, 'Ground floor West side', 0, FALSE);

-- Accessible Parking Spots (15 spots - Blue Badge holders)
INSERT INTO parking_spots (spot_number, type, price_per_hour, location_description, floor_level, is_covered) VALUES
('AA01', 'accessible', 6.00, 'Ground floor accessible bay near lift - North entrance', 0, FALSE),
('AA02', 'accessible', 6.00, 'Ground floor accessible bay near lift - North entrance', 0, FALSE),
('AA03', 'accessible', 6.00, 'Ground floor accessible bay near lift - North entrance', 0, FALSE),
('AA04', 'accessible', 6.00, 'Ground floor accessible bay near lift - North entrance', 0, FALSE),
('AA05', 'accessible', 6.00, 'Ground floor accessible bay near lift - South entrance', 0, FALSE),
('AA06', 'accessible', 6.00, 'Ground floor accessible bay near lift - South entrance', 0, FALSE),
('AA07', 'accessible', 6.00, 'Ground floor accessible bay near lift - South entrance', 0, FALSE),
('AB01', 'accessible', 7.50, 'Covered accessible parking with lift access', 1, TRUE),
('AB02', 'accessible', 7.50, 'Covered accessible parking with lift access', 1, TRUE),
('AB03', 'accessible', 7.50, 'Covered accessible parking with lift access', 1, TRUE),
('AB04', 'accessible', 7.50, 'Covered accessible parking with lift access', 1, TRUE),
('AB05', 'accessible', 7.50, 'Covered accessible parking with lift access', 1, TRUE),
('AC01', 'accessible', 6.00, 'Ground floor extra-wide accessible bay', 0, FALSE),
('AC02', 'accessible', 6.00, 'Ground floor extra-wide accessible bay', 0, FALSE),
('AC03', 'accessible', 6.00, 'Ground floor extra-wide accessible bay', 0, FALSE);

-- Premium Parking Spots (5 spots - VIP/Season ticket holders)
INSERT INTO parking_spots (spot_number, type, price_per_hour, location_description, floor_level, is_covered) VALUES
('VIP1', 'premium', 20.00, 'VIP covered parking closest to main entrance', 0, TRUE),
('VIP2', 'premium', 20.00, 'VIP covered parking closest to main entrance', 0, TRUE),
('VIP3', 'premium', 20.00, 'VIP covered parking closest to main entrance', 0, TRUE),
('VIP4', 'premium', 22.00, 'Premium covered parking with charging point', 0, TRUE),
('VIP5', 'premium', 22.00, 'Premium covered parking with charging point', 0, TRUE);

-- ====================================
-- SEED TEST USERS
-- ====================================

-- Password for all test users: "Password123!" (hashed with bcrypt)
-- Note: In production, these would be properly hashed. This is a placeholder.
INSERT INTO users (email, hashed_password, first_name, last_name, phone_number, is_disabled) VALUES
('john.smith@example.com', '$2b$10$YourHashedPasswordHere', 'John', 'Smith', '+447700900001', FALSE),
('sarah.jones@example.com', '$2b$10$YourHashedPasswordHere', 'Sarah', 'Jones', '+447700900002', FALSE),
('mike.wilson@example.com', '$2b$10$YourHashedPasswordHere', 'Mike', 'Wilson', '+447700900003', FALSE),
('emma.davis@example.com', '$2b$10$YourHashedPasswordHere', 'Emma', 'Davis', '+447700900004', TRUE),
('james.brown@example.com', '$2b$10$YourHashedPasswordHere', 'James', 'Brown', '+447700900005', FALSE),
('lisa.taylor@example.com', '$2b$10$YourHashedPasswordHere', 'Lisa', 'Taylor', '+447700900006', TRUE);

-- ====================================
-- SEED ACCESSIBILITY PREFERENCES
-- ====================================

-- Get user IDs for accessibility preferences
DO $$
DECLARE
    emma_id UUID;
    lisa_id UUID;
BEGIN
    SELECT user_id INTO emma_id FROM users WHERE email = 'emma.davis@example.com';
    SELECT user_id INTO lisa_id FROM users WHERE email = 'lisa.taylor@example.com';
    
    INSERT INTO accessibility_preferences 
    (user_id, needs_step_free, has_blue_badge, blue_badge_number, needs_audio_navigation, high_contrast_mode, preferred_text_size, screen_reader_enabled) 
    VALUES
    (emma_id, TRUE, TRUE, 'BB123456', TRUE, TRUE, 'large', TRUE),
    (lisa_id, TRUE, TRUE, 'BB789012', FALSE, TRUE, 'extra-large', FALSE);
END $$;

-- ====================================
-- SEED SAMPLE BOOKINGS (Past and Future)
-- ====================================

-- Create some historical bookings
DO $$
DECLARE
    john_id UUID;
    sarah_id UUID;
    spot_a001_id UUID;
    spot_aa01_id UUID;
    booking1_id UUID;
    booking2_id UUID;
BEGIN
    -- Get user and spot IDs
    SELECT user_id INTO john_id FROM users WHERE email = 'john.smith@example.com';
    SELECT user_id INTO sarah_id FROM users WHERE email = 'sarah.jones@example.com';
    SELECT spot_id INTO spot_a001_id FROM parking_spots WHERE spot_number = 'A001';
    SELECT spot_id INTO spot_aa01_id FROM parking_spots WHERE spot_number = 'AA01';
    
    -- Past completed booking
    INSERT INTO bookings 
    (user_id, spot_id, booking_date, start_time, end_time, total_amount, status)
    VALUES
    (john_id, spot_a001_id, CURRENT_DATE - INTERVAL '7 days', 
     CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '14 hours',
     CURRENT_TIMESTAMP - INTERVAL '7 days' + INTERVAL '18 hours',
     34.00, 'completed')
    RETURNING booking_id INTO booking1_id;
    
    -- Add payment for past booking
    INSERT INTO payments
    (booking_id, amount, square_payment_id, payment_status, payment_method, processed_at)
    VALUES
    (booking1_id, 34.00, 'sq_' || gen_random_uuid(), 'completed', 'card', CURRENT_TIMESTAMP - INTERVAL '7 days');
    
    -- Future confirmed booking
    INSERT INTO bookings 
    (user_id, spot_id, booking_date, start_time, end_time, total_amount, status)
    VALUES
    (sarah_id, spot_aa01_id, CURRENT_DATE + INTERVAL '3 days',
     CURRENT_TIMESTAMP + INTERVAL '3 days' + INTERVAL '15 hours',
     CURRENT_TIMESTAMP + INTERVAL '3 days' + INTERVAL '19 hours',
     24.00, 'confirmed')
    RETURNING booking_id INTO booking2_id;
    
    -- Add payment for future booking
    INSERT INTO payments
    (booking_id, amount, square_payment_id, payment_status, payment_method, processed_at)
    VALUES
    (booking2_id, 24.00, 'sq_' || gen_random_uuid(), 'completed', 'card', CURRENT_TIMESTAMP);
    
END $$;

-- ====================================
-- VERIFICATION QUERIES
-- ====================================

-- Display summary of seeded data
SELECT 'Parking Spots Created' AS summary, COUNT(*) AS count FROM parking_spots
UNION ALL
SELECT 'Users Created', COUNT(*) FROM users
UNION ALL
SELECT 'Accessibility Preferences', COUNT(*) FROM accessibility_preferences
UNION ALL
SELECT 'Bookings Created', COUNT(*) FROM bookings
UNION ALL
SELECT 'Payments Recorded', COUNT(*) FROM payments;

-- Show parking spot distribution
SELECT type, COUNT(*) as count, 
       ROUND(AVG(price_per_hour), 2) as avg_price
FROM parking_spots
GROUP BY type
ORDER BY type;

-- Show available spots by type
SELECT type, COUNT(*) as available_count
FROM parking_spots
WHERE is_available = TRUE
GROUP BY type
ORDER BY type;