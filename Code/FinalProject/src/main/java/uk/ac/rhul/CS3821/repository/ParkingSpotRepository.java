package uk.ac.rhul.CS3821.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uk.ac.rhul.CS3821.model.ParkingSpot;

import java.util.UUID;

/**
 * Repository for parking spot persistence operations.
 */
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, UUID> {
    // Reserved for future custom parking-spot queries.
}