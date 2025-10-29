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
