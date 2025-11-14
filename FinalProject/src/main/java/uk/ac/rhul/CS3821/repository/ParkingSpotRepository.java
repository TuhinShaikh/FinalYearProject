package uk.ac.rhul.CS3821.repository;

import uk.ac.rhul.CS3821.model.ParkingSpot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, UUID> {

    List<ParkingSpot> findByIsReserved(boolean isReserved);

    Optional<ParkingSpot> findBySpotName(String spotName);
}