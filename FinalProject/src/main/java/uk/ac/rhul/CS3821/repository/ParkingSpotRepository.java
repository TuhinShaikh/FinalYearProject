package uk.ac.rhul.CS3821.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uk.ac.rhul.CS3821.model.ParkingSpot;

import java.util.UUID;

// I keep spot persistence here so availability updates stay centralized.
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, UUID> {
    // I left this ready for future custom spot queries.
}