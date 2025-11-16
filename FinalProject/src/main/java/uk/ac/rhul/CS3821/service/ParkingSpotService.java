package uk.ac.rhul.CS3821.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.rhul.CS3821.model.ParkingSpot;
import uk.ac.rhul.CS3821.repository.ParkingSpotRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class ParkingSpotService {

    private final ParkingSpotRepository parkingSpotRepository;

    public ParkingSpotService(ParkingSpotRepository parkingSpotRepository) {
        this.parkingSpotRepository = parkingSpotRepository;
    }

    public ParkingSpot createSpot(ParkingSpot spot) {
        return parkingSpotRepository.save(spot);
    }

    public Optional<ParkingSpot> getSpotById(UUID spotId) {
        return parkingSpotRepository.findById(spotId);
    }

    public List<ParkingSpot> getAllSpots() {
        return parkingSpotRepository.findAll();
    }

    public ParkingSpot updateSpot(ParkingSpot spot) {
        return parkingSpotRepository.save(spot);
    }

    public void deleteSpot(UUID spotId) {
        parkingSpotRepository.deleteById(spotId);
    }
}