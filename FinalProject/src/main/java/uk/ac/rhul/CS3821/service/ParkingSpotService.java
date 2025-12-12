package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.rhul.CS3821.model.ParkingSpot;
import uk.ac.rhul.CS3821.repository.ParkingSpotRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Manages CRUD access to parking spot data while keeping persistence operations transactional.
 */
@Service
@Transactional
public class ParkingSpotService {

    private final ParkingSpotRepository parkingSpotRepository;

    public ParkingSpotService(ParkingSpotRepository parkingSpotRepository) {
        this.parkingSpotRepository = parkingSpotRepository;
    }

    /**
     * Persists parking spot metadata such as location, label, and status.
     */
    public ParkingSpot createSpot(ParkingSpot spot) {
        return parkingSpotRepository.save(spot);
    }

    /**
     * Retrieves a spot by id; Optional indicates if no matching entity exists.
     */
    public Optional<ParkingSpot> getSpotById(UUID spotId) {
        return parkingSpotRepository.findById(spotId);
    }

    /**
     * Returns every known spot, enabling the caller to build full availability grids.
     */
    public List<ParkingSpot> getAllSpots() {
        return parkingSpotRepository.findAll();
    }

    /**
     * Saves updated spot state when availability, pricing, or other attributes change.
     */
    public ParkingSpot updateSpot(ParkingSpot spot) {
        return parkingSpotRepository.save(spot);
    }

    /**
     * Deletes a spot record once it is deprecated or removed from the system.
     */
    public void deleteSpot(UUID spotId) {
        parkingSpotRepository.deleteById(spotId);
    }
}