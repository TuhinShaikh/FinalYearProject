package uk.ac.rhul.CS3821.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uk.ac.rhul.CS3821.model.ParkingSpot;

import java.util.UUID;

public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, UUID> {
    // Custom queries can be added here if needed
}sss