package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.rhul.CS3821.model.ParkingSpot;
import uk.ac.rhul.CS3821.repository.ParkingSpotRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * I keep spot CRUD logic here so controllers stay simple and writes remain transactional.
 */
@Service
@Transactional
public class ParkingSpotService {

    private final ParkingSpotRepository parkingSpotRepository;

    public ParkingSpotService(ParkingSpotRepository parkingSpotRepository) {
        this.parkingSpotRepository = parkingSpotRepository;
    }

    /**
     * I create new parking spots here so validation/persistence flow stays centralized.
     */
    public ParkingSpot createSpot(ParkingSpot spot) {
        return parkingSpotRepository.save(spot);
    }

    /**
     * I return Optional so callers can decide how to handle missing spots.
     */
    public Optional<ParkingSpot> getSpotById(UUID spotId) {
        return parkingSpotRepository.findById(spotId);
    }

    /**
     * I return every spot because the grid UI depends on full inventory data.
     */
    public List<ParkingSpot> getAllSpots() {
        return parkingSpotRepository.findAll();
    }

    /**
     * I use save for updates so creation/update persistence follows one path.
     */
    public ParkingSpot updateSpot(ParkingSpot spot) {
        return parkingSpotRepository.save(spot);
    }

    /**
     * I delete by id here to remove spots that are no longer usable.
     */
    public void deleteSpot(UUID spotId) {
        parkingSpotRepository.deleteById(spotId);
    }
}